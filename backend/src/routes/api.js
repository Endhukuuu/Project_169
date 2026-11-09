const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { 
    User, 
    Project, 
    ProjectAnalysis, 
    ProjectFile, 
    ProjectIssue, 
    CodeReview, 
    SingleAnalysis, 
    ActivityLog, 
    Notification 
} = require('../models');
const ai = require('../services/geminiService');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { logActivity, sendNotification } = require('../services/activityService');

// --- Health Check ---
router.get('/health', (req, res) => {
    const aiConfigured = !!process.env.GEMINI_API_KEY;
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected';
    res.json({
        status: 'ok',
        platform: 'Unified Developer Intelligence Hub (UDIH)',
        ai_provider: 'Google Gemini API',
        ai_status: aiConfigured ? 'Online' : 'Offline',
        db_provider: 'MongoDB Atlas',
        db_status: mongoStatus
    });
});

// All subsequent routes require authenticated user
router.use(verifyToken);

// ==========================================
// PROJECTS & PERSISTENT PROJECT IDENTITIES
// ==========================================

// Create a new project
router.post('/projects', async (req, res) => {
    try {
        const { name, description, language } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const project = await Project.create({
            name: name.trim(),
            description: (description || '').trim(),
            owner: req.user._id,
            languages: language ? [language] : [],
            status: 'active'
        });

        await logActivity(req.user._id, 'PROJECT_CREATED', `Created new project "${project.name}"`, {
            projectId: project._id,
            projectName: project.name
        });

        await sendNotification(
            req.user._id,
            'Project Created',
            `Project "${project.name}" was successfully registered.`,
            'success',
            `/projects/${project._id}`
        );

        res.status(201).json(project);
    } catch (err) {
        console.error('[API] Create project error:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// List projects (Admin: all, Developer: own)
router.get('/projects', async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
        const projects = await Project.find(query)
            .populate('owner', 'name email role')
            .sort({ updatedAt: -1 });

        // Augment with analysis and review counts
        const augmented = await Promise.all(projects.map(async (p) => {
            const [analysisCount, reviewCount, issueCount] = await Promise.all([
                ProjectAnalysis.countDocuments({ project: p._id }),
                CodeReview.countDocuments({ project: p._id }),
                ProjectIssue.countDocuments({ project: p._id })
            ]);

            return {
                ...p.toObject(),
                id: p._id, // Backwards compatibility for existing UI
                analysisCount,
                reviewCount,
                issueCount
            };
        }));

        res.json(augmented);
    } catch (err) {
        console.error('[API] Fetch projects error:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'name email role');
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Access control: non-admins can only access their own projects
        const projectOwnerId = project.owner?._id ? project.owner._id.toString() : project.owner?.toString();
        if (req.user.role !== 'admin' && projectOwnerId && projectOwnerId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this project.' });
        }

        res.json({
            ...project.toObject(),
            id: project._id
        });
    } catch (err) {
        console.error('[API] Fetch project error:', err);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Get comprehensive project details & complete review history
router.get('/projects/:id/details', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'name email role');
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Ownership enforcement
        const projectOwnerId = project.owner?._id ? project.owner._id.toString() : project.owner?.toString();
        if (req.user.role !== 'admin' && projectOwnerId && projectOwnerId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this project.' });
        }

        const [analyses, reviews, issues, files, activities] = await Promise.all([
            ProjectAnalysis.find({ project: project._id }).sort({ createdAt: -1 }),
            CodeReview.find({ project: project._id }).sort({ createdAt: -1 }),
            ProjectIssue.find({ project: project._id }).sort({ createdAt: -1 }),
            ProjectFile.find({ project: project._id }),
            ActivityLog.find({ project: project._id }).sort({ createdAt: -1 }).limit(20)
        ]);

        res.json({
            project: {
                ...project.toObject(),
                id: project._id
            },
            analyses,
            reviews,
            issues,
            files,
            activities
        });
    } catch (err) {
        console.error('[API] Project details error:', err);
        res.status(500).json({ error: 'Failed to fetch project details' });
    }
});

// Get all reviews for a specific project
router.get('/projects/:id/reviews', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const projectOwnerId = project.owner?._id ? project.owner._id.toString() : project.owner?.toString();
        if (req.user.role !== 'admin' && projectOwnerId && projectOwnerId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const reviews = await CodeReview.find({ project: project._id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error('[API] Project reviews error:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// ==========================================
// CODE ANALYZER (Single Snippet Analysis)
// ==========================================
router.post('/analyze', async (req, res) => {
    try {
        const { projectId, code, language, description } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        // Validate project ownership if projectId provided
        let targetProjectId = null;
        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID format' });
            }
            const p = await Project.findById(projectId);
            if (!p) {
                return res.status(404).json({ error: 'Project not found' });
            }
            const pOwnerId = p.owner?._id ? p.owner._id.toString() : p.owner?.toString();
            if (req.user.role !== 'admin' && pOwnerId && pOwnerId !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Access denied. You do not own this project.' });
            }
            targetProjectId = p._id;
        }

        // Run Optimized Gemini Semantic Analysis
        const aiResult = await ai.analyzeCode(code, language, description);

        // Save to MongoDB
        const analysis = await SingleAnalysis.create({
            project: targetProjectId,
            user: req.user._id,
            codeSnippet: code,
            language,
            qualityScore: aiResult.qualityScore,
            intent: aiResult.intent,
            summary: aiResult.summary,
            complexity: aiResult.complexity || { time: 'O(n)', space: 'O(1)' },
            issues: (aiResult.issues || []).map(i => ({
                title: i.title,
                severity: i.severity || 'Medium',
                explanation: i.explanation || i.description || '',
                rootCause: i.root_cause || '',
                suggestedFix: i.suggested_fix || '',
                correctedCode: i.corrected_code || null
            }))
        });

        await logActivity(req.user._id, 'CODE_ANALYSIS_COMPLETED', `Analyzed ${language} snippet (Quality Score: ${aiResult.qualityScore})`, {
            analysisId: analysis._id,
            projectId: targetProjectId,
            language
        });

        res.status(201).json({
            ...analysis.toObject(),
            id: analysis._id, // Backward compatibility
            complexity_time: analysis.complexity?.time,
            complexity_space: analysis.complexity?.space
        });
    } catch (err) {
        console.error('[API] Single analyze error:', err);
        res.status(500).json({ error: err.message || 'Analysis failed' });
    }
});

// List snippet analyses
router.get('/analyses', async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const analyses = await SingleAnalysis.find(query)
            .populate('project', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const mapped = analyses.map(a => ({
            ...a.toObject(),
            id: a._id,
            project_name: a.project?.name || null,
            quality_score: a.qualityScore,
            issue_count: a.issues?.length || 0,
            created_at: a.createdAt
        }));

        res.json(mapped);
    } catch (err) {
        console.error('[API] Fetch analyses error:', err);
        res.status(500).json({ error: 'Failed to fetch analyses' });
    }
});

// Get single snippet analysis
router.get('/analyses/:id', async (req, res) => {
    try {
        const analysis = await SingleAnalysis.findById(req.params.id).populate('project', 'name');
        if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

        if (req.user.role !== 'admin' && analysis.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            ...analysis.toObject(),
            id: analysis._id,
            complexity_time: analysis.complexity?.time,
            complexity_space: analysis.complexity?.space
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});

// ==========================================
// CODE REVIEWS
// ==========================================
router.post('/reviews', async (req, res) => {
    try {
        const { projectId, title, code, language, description } = req.body;
        if (!code || !language || !title) {
            return res.status(400).json({ error: 'Title, code, and language are required' });
        }

        let targetProjectId = null;
        let projectName = '';
        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ error: 'Invalid project ID format' });
            }
            const p = await Project.findById(projectId);
            if (!p) {
                return res.status(404).json({ error: 'Project not found' });
            }
            const pOwnerId = p.owner?._id ? p.owner._id.toString() : p.owner?.toString();
            if (req.user.role !== 'admin' && pOwnerId && pOwnerId !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Access denied. You do not own this project.' });
            }
            targetProjectId = p._id;
            projectName = p.name;
        }

        // Run Optimized Gemini Review
        const aiResult = await ai.reviewCode(code, language, description);

        // Map issues and construct comments
        const issues = (aiResult.issues || []).map(i => ({
            title: i.title,
            severity: i.severity || 'Medium',
            explanation: i.explanation || '',
            rootCause: i.root_cause || '',
            suggestedFix: i.suggested_fix || '',
            correctedCode: i.corrected_code || null
        }));

        const comments = issues.map(issue => ({
            user: req.user._id,
            userName: 'AI Code Reviewer',
            content: `[AI - ${issue.severity}] ${issue.title}\n\n${issue.explanation}\n\nSuggested Fix: ${issue.suggestedFix}`,
            status: 'Open',
            createdAt: new Date()
        }));

        const review = await CodeReview.create({
            project: targetProjectId,
            user: req.user._id,
            title: title.trim(),
            description: (description || '').trim(),
            codeSnippet: code,
            language,
            score: aiResult.score || 80,
            status: 'In Review',
            strengths: aiResult.strengths || [],
            problems: aiResult.problems || [],
            recommendations: aiResult.recommendations || [],
            issues,
            comments
        });

        await logActivity(req.user._id, 'CODE_REVIEW_COMPLETED', `Performed code review "${review.title}" (Score: ${review.score})`, {
            reviewId: review._id,
            projectId: targetProjectId,
            projectName,
            score: review.score
        });

        await sendNotification(
            req.user._id,
            'Code Review Completed',
            `Review for "${review.title}" completed with score ${review.score}/100.`,
            review.score >= 70 ? 'success' : 'warning',
            `/review`
        );

        res.status(201).json({
            ...review.toObject(),
            id: review._id,
            ai_insights: aiResult
        });
    } catch (err) {
        console.error('[API] Review error:', err);
        res.status(500).json({ error: err.message || 'Review failed' });
    }
});

// List reviews
router.get('/reviews', async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const reviews = await CodeReview.find(query)
            .populate('project', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const mapped = reviews.map(r => ({
            ...r.toObject(),
            id: r._id,
            project_name: r.project?.name || null,
            comment_count: r.comments?.length || 0,
            created_at: r.createdAt
        }));

        res.json(mapped);
    } catch (err) {
        console.error('[API] Fetch reviews error:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get single review
router.get('/reviews/:id', async (req, res) => {
    try {
        const review = await CodeReview.findById(req.params.id).populate('project', 'name');
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            ...review.toObject(),
            id: review._id,
            created_at: review.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch review' });
    }
});

// Add comment to review
router.post('/reviews/:id/comments', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Comment content is required' });

        const review = await CodeReview.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Access control: only owner or admin can comment
        const reviewUserId = review.user?._id ? review.user._id.toString() : review.user?.toString();
        if (req.user.role !== 'admin' && reviewUserId && reviewUserId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this review.' });
        }

        const newComment = {
            user: req.user._id,
            userName: req.user.name,
            content: content.trim(),
            status: 'Open',
            createdAt: new Date()
        };

        review.comments.push(newComment);
        await review.save();

        res.status(201).json(review.comments[review.comments.length - 1]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Update review status
router.patch('/reviews/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const review = await CodeReview.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Access control: only owner or admin can update status
        const reviewUserId = review.user?._id ? review.user._id.toString() : review.user?.toString();
        if (req.user.role !== 'admin' && reviewUserId && reviewUserId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this review.' });
        }

        review.status = status;
        await review.save();

        res.json({ success: true, status: review.status });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review status' });
    }
});

// Update review comment status
router.patch('/reviews/:reviewId/comments/:commentId', async (req, res) => {
    try {
        const { status } = req.body;
        const review = await CodeReview.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Access control: only owner or admin can update comment status
        const reviewUserId = review.user?._id ? review.user._id.toString() : review.user?.toString();
        if (req.user.role !== 'admin' && reviewUserId && reviewUserId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this review.' });
        }

        const comment = review.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        comment.status = status;
        await review.save();

        res.json({ success: true, status: comment.status });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update comment status' });
    }
});

// ==========================================
// ANALYTICS & REPORTING
// ==========================================
router.get('/analytics/overview', async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const userFilter = isAdmin ? {} : { user: req.user._id };
        const projectFilter = isAdmin ? {} : { owner: req.user._id };

        // For developers, strictly isolate issues and files by their own projects
        let projectIssueFilter = {};
        let projectFileFilter = {};
        if (!isAdmin) {
            const userProjects = await Project.find({ owner: req.user._id }).select('_id');
            const userProjectIds = userProjects.map(p => p._id);
            projectIssueFilter = { project: { $in: userProjectIds } };
            projectFileFilter = { project: { $in: userProjectIds } };
        }

        const [
            singleAnalysesCount,
            piAnalysesCount,
            codeReviewsCount,
            projectCount,
            piIssuesCount,
            piFilesCount
        ] = await Promise.all([
            SingleAnalysis.countDocuments(userFilter),
            ProjectAnalysis.countDocuments(userFilter),
            CodeReview.countDocuments(userFilter),
            Project.countDocuments(projectFilter),
            ProjectIssue.countDocuments(projectIssueFilter),
            ProjectFile.countDocuments(projectFileFilter)
        ]);

        const totalAnalyses = singleAnalysesCount + piAnalysesCount;

        // Calculate Average Quality Score
        const [singleAvg, piAvg] = await Promise.all([
            SingleAnalysis.aggregate([
                { $match: userFilter },
                { $group: { _id: null, avgScore: { $avg: '$qualityScore' } } }
            ]),
            ProjectAnalysis.aggregate([
                { $match: userFilter },
                { $group: { _id: null, avgScore: { $avg: '$qualityScore' } } }
            ])
        ]);

        let avgQualityScore = 0;
        const sScore = singleAvg[0]?.avgScore;
        const pScore = piAvg[0]?.avgScore;
        if (sScore && pScore) avgQualityScore = Math.round((sScore + pScore) / 2);
        else if (sScore) avgQualityScore = Math.round(sScore);
        else if (pScore) avgQualityScore = Math.round(pScore);

        // Severity Distribution
        const severitiesAggregate = await ProjectIssue.aggregate([
            { $match: projectIssueFilter },
            { $group: { _id: '$severity', count: { $sum: 1 } } }
        ]);
        const severities = severitiesAggregate.map(s => ({
            severity: s._id || 'Medium',
            count: s.count
        }));

        // Analysis Activity Over Time (last 30 days) - strictly track real analyses performed
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [singleTimeline, piTimeline] = await Promise.all([
            SingleAnalysis.aggregate([
                { $match: { ...userFilter, createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                }
            ]),
            ProjectAnalysis.aggregate([
                { $match: { ...userFilter, createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const dailyMap = new Map();
        for (const item of singleTimeline) {
            dailyMap.set(item._id, (dailyMap.get(item._id) || 0) + item.count);
        }
        for (const item of piTimeline) {
            dailyMap.set(item._id, (dailyMap.get(item._id) || 0) + item.count);
        }

        const activity = Array.from(dailyMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, analyses: count }));

        res.json({
            analyses_count: totalAnalyses,
            avg_quality_score: avgQualityScore,
            issues_count: piIssuesCount,
            reviews_count: codeReviewsCount,
            pi_projects: projectCount,
            pi_files: piFilesCount,
            severities,
            activity
        });
    } catch (err) {
        console.error('[API] Analytics overview error:', err);
        res.status(500).json({ error: 'Failed to retrieve analytics overview' });
    }
});

// ==========================================
// USER ACTIVITY & NOTIFICATIONS
// ==========================================
router.get('/activity', async (req, res) => {
    try {
        const activities = await ActivityLog.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(25);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user activity' });
    }
});

router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.patch('/notifications/:id/read', async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

router.post('/notifications/read-all', async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user._id }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications read' });
    }
});

module.exports = router;
