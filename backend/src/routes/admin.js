const express = require('express');
const router = express.Router();
const { User, Project, ProjectAnalysis, ProjectIssue, CodeReview, SingleAnalysis, ActivityLog } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { logActivity, sendNotification } = require('../services/activityService');

// All admin routes require authentication and admin role
router.use(verifyToken, requireAdmin);

// --- Platform Overview Statistics ---
router.get('/stats', async (req, res) => {
    try {
        const onlineThreshold = new Date(Date.now() - 3 * 60 * 1000);

        const [
            totalUsers,
            activeUsers,
            inactiveUsers,
            onlineUsers,
            totalProjects,
            totalProjectAnalyses,
            totalSingleAnalyses,
            totalReviews,
            totalIssues,
            recentUsers,
            recentActivities
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'inactive' }),
            User.countDocuments({ status: 'active', lastActive: { $gte: onlineThreshold } }),
            Project.countDocuments(),
            ProjectAnalysis.countDocuments(),
            SingleAnalysis.countDocuments(),
            CodeReview.countDocuments(),
            ProjectIssue.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5),
            ActivityLog.find().sort({ createdAt: -1 }).limit(10)
        ]);

        res.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers,
                online: onlineUsers
            },
            projects: {
                total: totalProjects
            },
            analyses: {
                totalProjectAnalyses,
                totalSingleAnalyses,
                total: totalProjectAnalyses + totalSingleAnalyses
            },
            reviews: {
                total: totalReviews
            },
            issues: {
                total: totalIssues
            },
            recentUsers,
            recentActivities
        });
    } catch (err) {
        console.error('[Admin] Stats error:', err);
        res.status(500).json({ error: 'Failed to retrieve platform statistics' });
    }
});

// --- User Management List ---
router.get('/users', async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && role !== 'all') {
            query.role = role;
        }

        const onlineThreshold = new Date(Date.now() - 3 * 60 * 1000);

        if (status && status !== 'all') {
            if (status === 'online') {
                query.status = 'active';
                query.lastActive = { $gte: onlineThreshold };
            } else if (status === 'offline') {
                query.status = 'active';
                query.$or = [
                    { lastActive: { $lt: onlineThreshold } },
                    { lastActive: { $exists: false } },
                    { lastActive: null }
                ];
            } else if (status === 'inactive') {
                query.status = 'inactive';
            } else if (status === 'active') {
                query.status = 'active';
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [users, totalCount] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query)
        ]);

        // Augment each user with project and review metrics
        const augmentedUsers = await Promise.all(users.map(async (u) => {
            const [projectCount, analysisCount, reviewCount] = await Promise.all([
                Project.countDocuments({ owner: u._id }),
                ProjectAnalysis.countDocuments({ user: u._id }),
                CodeReview.countDocuments({ user: u._id })
            ]);

            const isOnline = u.status === 'active' && u.lastActive && (Date.now() - new Date(u.lastActive).getTime() < 3 * 60 * 1000);

            return {
                ...u.toJSON(),
                isOnline: !!isOnline,
                lastActive: u.lastActive,
                projectCount,
                analysisCount,
                reviewCount
            };
        }));

        res.json({
            users: augmentedUsers,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('[Admin] Users list error:', err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// --- Individual User Progress & Details ---
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [
            projects,
            projectAnalyses,
            singleAnalyses,
            codeReviews,
            activities
        ] = await Promise.all([
            Project.find({ owner: user._id }).sort({ updatedAt: -1 }),
            ProjectAnalysis.find({ user: user._id }).sort({ createdAt: -1 }),
            SingleAnalysis.find({ user: user._id }).sort({ createdAt: -1 }),
            CodeReview.find({ user: user._id }).sort({ createdAt: -1 }),
            ActivityLog.find({ user: user._id }).sort({ createdAt: -1 }).limit(30)
        ]);

        // Calculate real progress statistics based on actual user data
        // 1. Project Analysis Completion Rate: analyzed projects / total projects
        const analyzedProjectsCount = new Set(projectAnalyses.map(a => a.project?.toString())).size;
        const projectCompletionRate = projects.length > 0 
            ? Math.min(100, Math.round((analyzedProjectsCount / projects.length) * 100))
            : 0;

        // 2. Average quality score across completed analyses
        const allScores = [...projectAnalyses.map(a => a.qualityScore), ...singleAnalyses.map(s => s.qualityScore)].filter(s => typeof s === 'number');
        const avgQualityScore = allScores.length > 0
            ? Math.round(allScores.reduce((acc, s) => acc + s, 0) / allScores.length)
            : 0;

        // 3. Issue resolution / review rate: resolved reviews vs total reviews
        const resolvedReviewsCount = codeReviews.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;
        const reviewResolutionRate = codeReviews.length > 0
            ? Math.round((resolvedReviewsCount / codeReviews.length) * 100)
            : 0;

        const isOnline = user.status === 'active' && user.lastActive && (Date.now() - new Date(user.lastActive).getTime() < 3 * 60 * 1000);

        res.json({
            user: {
                ...user.toJSON(),
                isOnline: !!isOnline,
                lastActive: user.lastActive
            },
            progress: {
                totalProjects: projects.length,
                analyzedProjectsCount,
                projectCompletionRate,
                avgQualityScore,
                totalAnalyses: projectAnalyses.length + singleAnalyses.length,
                totalReviews: codeReviews.length,
                resolvedReviews: resolvedReviewsCount,
                reviewResolutionRate
            },
            projects,
            projectAnalyses,
            singleAnalyses,
            codeReviews,
            recentActivities: activities
        });
    } catch (err) {
        console.error('[Admin] User details error:', err);
        res.status(500).json({ error: 'Failed to retrieve user profile and progress' });
    }
});

// --- Update User Status (Activate/Deactivate) ---
router.patch('/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Status must be active or inactive' });
        }

        // Prevent admin from deactivating themselves
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ error: 'You cannot deactivate your own administrative account' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await logActivity(req.user._id, 'USER_STATUS_UPDATED', `Admin changed user ${user.email} status to ${status}`, {
            targetUserId: user._id,
            newStatus: status
        });

        await sendNotification(
            user._id,
            'Account Status Updated',
            `Your account status was set to ${status} by an administrator.`,
            status === 'active' ? 'success' : 'warning'
        );

        res.json({ message: `User status successfully updated to ${status}`, user: user.toJSON() });
    } catch (err) {
        console.error('[Admin] Status update error:', err);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// --- Update User Role ---
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'developer'].includes(role)) {
            return res.status(400).json({ error: 'Role must be admin or developer' });
        }

        // Prevent self-demotion
        if (req.user._id.toString() === req.params.id && role !== 'admin') {
            return res.status(400).json({ error: 'You cannot remove your own administrative privileges' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await logActivity(req.user._id, 'USER_ROLE_UPDATED', `Admin changed user ${user.email} role to ${role}`, {
            targetUserId: user._id,
            newRole: role
        });

        res.json({ message: `User role successfully updated to ${role}`, user: user.toJSON() });
    } catch (err) {
        console.error('[Admin] Role update error:', err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// --- Platform-Wide Activity Logs ---
router.get('/activity', async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [activities, total] = await Promise.all([
            ActivityLog.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ActivityLog.countDocuments()
        ]);

        res.json({
            activities,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error('[Admin] Activity log error:', err);
        res.status(500).json({ error: 'Failed to retrieve activity logs' });
    }
});

module.exports = router;
