const express = require('express');
const router = express.Router();
const db = require('../services/dbService');
const ai = require('../services/geminiService');

// --- Health ---
router.get('/health', (req, res) => {
    const aiConfigured = !!process.env.GEMINI_API_KEY;
    res.json({
        status: 'ok',
        ai_provider: 'Gemini API',
        ai_status: aiConfigured ? 'Online' : 'Offline',
        db_status: 'Connected'
    });
});

// --- Projects ---
router.post('/projects', async (req, res) => {
    try {
        const { name, description, language } = req.body;
        if (!name || !language) {
            return res.status(400).json({ error: 'Name and language are required' });
        }
        const result = await db.run(
            'INSERT INTO projects (name, description, language) VALUES (?, ?, ?)',
            [name, description, language]
        );
        res.json({ id: result.id, name, description, language });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const projects = await db.all('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// --- Analysis ---
router.post('/analyze', async (req, res) => {
    try {
        const { projectId, code, language, description } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        // Run AI Analysis
        const aiResult = await ai.analyzeCode(code, language, description);

        // Save to DB
        const result = await db.run(`
            INSERT INTO analyses (project_id, code_snippet, language, quality_score, intent, summary, complexity_time, complexity_space)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            projectId || null, code, language, aiResult.qualityScore, aiResult.intent, aiResult.summary, 
            aiResult.complexity?.time, aiResult.complexity?.space
        ]);

        const analysisId = result.id;

        // Save issues
        if (aiResult.issues && aiResult.issues.length > 0) {
            for (const issue of aiResult.issues) {
                await db.run(`
                    INSERT INTO analysis_issues (analysis_id, title, severity, explanation, root_cause, suggested_fix, corrected_code)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    analysisId, issue.title, issue.severity, issue.explanation, issue.root_cause, issue.suggested_fix, issue.corrected_code
                ]);
            }
        }

        const fullAnalysis = await db.get('SELECT * FROM analyses WHERE id = ?', [analysisId]);
        const issues = await db.all('SELECT * FROM analysis_issues WHERE analysis_id = ?', [analysisId]);

        res.json({ ...fullAnalysis, issues });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Analysis failed' });
    }
});

router.get('/analyses', async (req, res) => {
    try {
        const analyses = await db.all(`
            SELECT a.*, p.name as project_name 
            FROM analyses a 
            LEFT JOIN projects p ON a.project_id = p.id 
            ORDER BY a.created_at DESC
        `);
        // Attach issue counts
        for (let a of analyses) {
            const count = await db.get('SELECT count(*) as c FROM analysis_issues WHERE analysis_id = ?', [a.id]);
            a.issue_count = count.c;
        }
        res.json(analyses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch analyses' });
    }
});

router.get('/analyses/:id', async (req, res) => {
    try {
        const analysis = await db.get('SELECT * FROM analyses WHERE id = ?', [req.params.id]);
        if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
        
        const issues = await db.all('SELECT * FROM analysis_issues WHERE analysis_id = ?', [analysis.id]);
        res.json({ ...analysis, issues });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});

// --- Reviews ---
router.post('/reviews', async (req, res) => {
    try {
        const { projectId, title, code, language, description } = req.body;
        if (!code || !language || !title) {
            return res.status(400).json({ error: 'Title, code, and language are required' });
        }

        // AI Review
        const aiResult = await ai.reviewCode(code, language, description);

        // Save review
        const result = await db.run(`
            INSERT INTO reviews (project_id, title, description, score, code_snippet, language, status)
            VALUES (?, ?, ?, ?, ?, ?, 'In Review')
        `, [projectId || null, title, description, aiResult.score, code, language]);

        const reviewId = result.id;

        // Save AI issues as comments
        if (aiResult.issues && aiResult.issues.length > 0) {
            for (const issue of aiResult.issues) {
                const content = `[AI - ${issue.severity}] ${issue.title}\n\n${issue.explanation}\n\nFix: ${issue.suggested_fix}`;
                await db.run('INSERT INTO review_comments (review_id, content) VALUES (?, ?)', [reviewId, content]);
            }
        }

        const fullReview = await db.get('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        const comments = await db.all('SELECT * FROM review_comments WHERE review_id = ? ORDER BY created_at ASC', [reviewId]);
        
        res.json({ ...fullReview, comments, ai_insights: aiResult });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Review failed' });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await db.all(`
            SELECT r.*, p.name as project_name 
            FROM reviews r 
            LEFT JOIN projects p ON r.project_id = p.id 
            ORDER BY r.created_at DESC
        `);
        for (let r of reviews) {
            const count = await db.get('SELECT count(*) as c FROM review_comments WHERE review_id = ?', [r.id]);
            r.comment_count = count.c;
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

router.get('/reviews/:id', async (req, res) => {
    try {
        const review = await db.get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        
        const comments = await db.all('SELECT * FROM review_comments WHERE review_id = ? ORDER BY created_at ASC', [review.id]);
        res.json({ ...review, comments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch review' });
    }
});

router.post('/reviews/:id/comments', async (req, res) => {
    try {
        const { content } = req.body;
        const result = await db.run('INSERT INTO review_comments (review_id, content) VALUES (?, ?)', [req.params.id, content]);
        const comment = await db.get('SELECT * FROM review_comments WHERE id = ?', [result.id]);
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

router.patch('/reviews/:reviewId/comments/:commentId', async (req, res) => {
    try {
        const { status } = req.body;
        await db.run('UPDATE review_comments SET status = ? WHERE id = ?', [status, req.params.commentId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

router.patch('/reviews/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.run('UPDATE reviews SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review status' });
    }
});

// --- Analytics ---
router.get('/analytics/overview', async (req, res) => {
    try {
        const analyses = await db.get('SELECT count(*) as total, avg(quality_score) as avg_score FROM analyses');
        const issues = await db.get('SELECT count(*) as total FROM analysis_issues');
        const reviews = await db.get('SELECT count(*) as total FROM reviews');
        
        const piAnalyses = await db.get('SELECT count(*) as total, avg(quality_score) as avg_score FROM project_analyses');
        const piIssues = await db.get('SELECT count(*) as total FROM project_analysis_issues');
        const piFiles = await db.get('SELECT sum(size) as total_size, count(*) as total_files FROM project_analysis_files');

        // Distribution of severity (combine both)
        const severitiesSnippet = await db.all('SELECT severity, count(*) as count FROM analysis_issues GROUP BY severity');
        const severitiesPI = await db.all('SELECT severity, count(*) as count FROM project_analysis_issues GROUP BY severity');
        
        let severityMap = {};
        severitiesSnippet.forEach(s => severityMap[s.severity] = (severityMap[s.severity] || 0) + s.count);
        severitiesPI.forEach(s => severityMap[s.severity] = (severityMap[s.severity] || 0) + s.count);
        const severities = Object.keys(severityMap).map(k => ({ severity: k, count: severityMap[k] }));

        // Activity over time (combine both)
        const activitySnippet = await db.all(`
            SELECT date(created_at) as date, count(*) as count
            FROM analyses
            GROUP BY date(created_at)
        `);
        const activityPI = await db.all(`
            SELECT date(created_at) as date, count(*) as count
            FROM project_analyses
            GROUP BY date(created_at)
        `);

        let dateMap = {};
        activitySnippet.forEach(a => dateMap[a.date] = (dateMap[a.date] || 0) + a.count);
        activityPI.forEach(a => dateMap[a.date] = (dateMap[a.date] || 0) + a.count);
        const activity = Object.keys(dateMap).sort().reverse().slice(0, 30).map(k => ({ date: k, analyses: dateMap[k] }));

        const totalAnalyses = (analyses.total || 0) + (piAnalyses.total || 0);
        let avgScore = 0;
        if (totalAnalyses > 0) {
            const sumScore = ((analyses.total || 0) * (analyses.avg_score || 0)) + ((piAnalyses.total || 0) * (piAnalyses.avg_score || 0));
            avgScore = sumScore / totalAnalyses;
        }

        res.json({
            analyses_count: totalAnalyses,
            avg_quality_score: Math.round(avgScore),
            issues_count: (issues.total || 0) + (piIssues.total || 0),
            reviews_count: reviews.total || 0,
            pi_projects: piAnalyses.total || 0,
            pi_files: piFiles.total_files || 0,
            severities,
            activity: activity.reverse()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
