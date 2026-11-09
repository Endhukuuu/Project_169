const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const mongoose = require('mongoose');
const { 
    Project, 
    ProjectAnalysis, 
    ProjectFile, 
    ProjectIssue 
} = require('../models');
const ai = require('../services/geminiService');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { logActivity, sendNotification } = require('../services/activityService');

const upload = multer({ dest: 'uploads/' });

// Ignore patterns
const ignoredPatterns = [
    'node_modules/', '.git/', '.venv/', 'venv/', 'dist/', 'build/', 'coverage/', 
    '.next/', 'target/', 'bin/', 'obj/', '__pycache__/', 'vendor/'
];

const ignoredExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.avi', '.mov', '.ico', '.svg', 
    '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.tar', '.gz', '.class', '.pyc', '.exe', '.dll'
];

const shouldIgnore = (filePath) => {
    const lower = filePath.toLowerCase();
    // Guard against leaking actual .env secret files, while preserving .env.example / .env.sample templates
    if (lower === '.env' || lower.endsWith('/.env') || lower.endsWith('\\.env') || lower.includes('.env.local')) {
        if (!lower.endsWith('.env.example') && !lower.endsWith('.env.sample') && !lower.endsWith('.env.template')) {
            return true;
        }
    }
    if (ignoredPatterns.some(p => filePath.includes(p))) return true;
    if (ignoredExtensions.some(ext => filePath.toLowerCase().endsWith(ext))) return true;
    return false;
};

const getLanguageFromExt = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    const map = {
        'js': 'JavaScript', 'jsx': 'JavaScript React',
        'ts': 'TypeScript', 'tsx': 'TypeScript React',
        'py': 'Python', 'java': 'Java', 'c': 'C', 'cpp': 'C++',
        'cs': 'C#', 'go': 'Go', 'rs': 'Rust', 'php': 'PHP',
        'rb': 'Ruby', 'html': 'HTML', 'css': 'CSS', 'json': 'JSON',
        'sql': 'SQL', 'md': 'Markdown', 'yml': 'YAML', 'yaml': 'YAML', 'xml': 'XML'
    };
    return map[ext] || 'Unknown';
};

// ==========================================
// UPLOAD PROJECT ZIP
// ==========================================
router.post('/upload', verifyToken, upload.single('project'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const zip = new AdmZip(req.file.path);
        const zipEntries = zip.getEntries();
        
        let files = [];
        let folders = new Set();
        let languages = new Set();
        let totalSize = 0;

        zipEntries.forEach(zipEntry => {
            if (shouldIgnore(zipEntry.entryName)) return;

            if (zipEntry.isDirectory) {
                folders.add(zipEntry.entryName);
            } else {
                const parts = zipEntry.entryName.split('/');
                if (parts.length > 1) {
                    for (let i = 1; i < parts.length; i++) {
                        folders.add(parts.slice(0, i).join('/') + '/');
                    }
                }
                
                const lang = getLanguageFromExt(zipEntry.entryName);
                if (lang !== 'Unknown') languages.add(lang);

                let content = '';
                try {
                    content = zipEntry.getData().toString('utf8');
                } catch(e) {}

                if (content.trim()) {
                    totalSize += zipEntry.header.size;
                    files.push({
                        path: zipEntry.entryName,
                        language: lang,
                        size: zipEntry.header.size,
                        content: content
                    });
                }
            }
        });

        // Clean up uploaded zip file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        const projectName = req.body.projectName || req.file.originalname.replace('.zip', '');

        // If authenticated user uploaded, optionally bind/create project identity
        let projectId = req.body.projectId;
        if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
            const existingProj = await Project.findById(projectId);
            if (!existingProj || (req.user.role !== 'admin' && existingProj.owner.toString() !== req.user._id.toString())) {
                projectId = null;
            }
        }

        if (!projectId) {
            const project = await Project.create({
                name: projectName,
                description: `Uploaded project archive (${files.length} source files)`,
                owner: req.user._id,
                languages: Array.from(languages),
                fileCount: files.length,
                folderCount: folders.size,
                totalSize
            });
            projectId = project._id;
            await logActivity(req.user._id, 'ZIP_UPLOADED', `Uploaded ZIP archive for "${projectName}"`, {
                projectId: project._id,
                projectName: project.name,
                fileCount: files.length
            });
        }

        const manifest = {
            projectId,
            projectName,
            fileCount: files.length,
            folderCount: folders.size,
            languages: Array.from(languages),
            files: files.map(f => ({ path: f.path, language: f.language, size: f.size }))
        };

        res.json({ manifest, extractedFiles: files });
    } catch (err) {
        console.error('[ProjectIntelligence] Upload error:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to process project ZIP' });
    }
});

// ==========================================
// RUN FULL PROJECT ANALYSIS
// ==========================================
router.post('/analyze', verifyToken, async (req, res) => {
    try {
        const { projectId, manifest, files } = req.body;
        if (!manifest || !files) {
            return res.status(400).json({ error: 'Manifest and files are required' });
        }

        // Establish permanent project identity
        let targetProject = null;
        if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
            targetProject = await Project.findById(projectId);
        }

        if (!targetProject) {
            targetProject = await Project.create({
                name: manifest.projectName || 'Uploaded Project',
                description: `Project intelligence analysis target (${files.length} files)`,
                owner: req.user._id,
                languages: manifest.languages || [],
                fileCount: files.length,
                status: 'active'
            });
        } else if (req.user.role !== 'admin' && targetProject.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You do not own this project.' });
        }

        // Run Optimized Gemini Pipeline
        const report = await ai.analyzeFullProjectPipeline(manifest, files);

        // Calculate or derive accurate quality score
        let calculatedQualityScore = report.qualityScore;
        if (typeof calculatedQualityScore !== 'number') {
            const crit = report.issues?.filter(i => i.severity?.toLowerCase() === 'critical').length || 0;
            const high = report.issues?.filter(i => i.severity?.toLowerCase() === 'high').length || 0;
            const med = report.issues?.filter(i => i.severity?.toLowerCase() === 'medium').length || 0;
            const low = report.issues?.filter(i => i.severity?.toLowerCase() === 'low').length || 0;
            calculatedQualityScore = Math.max(15, Math.min(100, 100 - (crit * 25 + high * 15 + med * 8 + low * 3)));
        }

        // Save analysis to MongoDB
        const analysis = await ProjectAnalysis.create({
            project: targetProject._id,
            user: req.user._id,
            projectName: targetProject.name,
            summary: report.projectSummary || '',
            architecture: report.architecture || { pattern: 'Client-Server' },
            qualityScore: calculatedQualityScore,
            languages: manifest.languages || [],
            status: 'Completed',
            relationships: report.relationships || [],
            dataFlow: report.dataFlow || '',
            recommendations: report.recommendations || [],
            securityFindings: report.securityFindings || [],
            modules: report.modules || [],
            performanceMetrics: report.performanceMetrics || {},
            fileCount: manifest.files?.length || 0,
            issueCount: report.issues?.length || 0
        });

        // Save files with imports/exports
        const fileDocs = (manifest.files || []).map(f => {
            const details = report.fileDetails?.find(d => d.path === f.path) || {};
            return {
                project: targetProject._id,
                analysis: analysis._id,
                path: f.path,
                language: f.language || 'Unknown',
                size: f.size || 0,
                imports: details.imports || [],
                exports: details.exports || []
            };
        });
        if (fileDocs.length > 0) {
            await ProjectFile.insertMany(fileDocs);
        }

        // Save issues
        const issueDocs = (report.issues || []).map(issue => ({
            project: targetProject._id,
            analysis: analysis._id,
            title: issue.title,
            severity: issue.severity || 'Medium',
            category: issue.category || 'Maintainability',
            filePath: issue.file_path || 'Project',
            lineNumber: issue.line_number || 'File-level issue',
            description: issue.description || '',
            rootCause: issue.root_cause || '',
            impact: issue.impact || '',
            suggestedFix: issue.suggested_fix || ''
        }));
        if (issueDocs.length > 0) {
            await ProjectIssue.insertMany(issueDocs);
        }

        // Update project lastAnalyzedAt and file metrics
        targetProject.lastAnalyzedAt = new Date();
        targetProject.fileCount = manifest.files?.length || targetProject.fileCount;
        if (manifest.languages && manifest.languages.length > 0) {
            targetProject.languages = Array.from(new Set([...targetProject.languages, ...manifest.languages]));
        }
        await targetProject.save();

        // Activity log & Notification
        await logActivity(req.user._id, 'PROJECT_ANALYSIS_COMPLETED', `Completed full architecture analysis for "${targetProject.name}" (Score: ${analysis.qualityScore})`, {
            analysisId: analysis._id,
            projectId: targetProject._id,
            projectName: targetProject.name,
            score: analysis.qualityScore,
            issuesCount: issueDocs.length
        });

        await sendNotification(
            req.user._id,
            'Project Analysis Ready',
            `Architecture & security analysis for "${targetProject.name}" completed with quality score ${analysis.qualityScore}/100.`,
            'success',
            `/projects/${targetProject._id}`
        );

        const dbFiles = await ProjectFile.find({ analysis: analysis._id });
        const dbIssues = await ProjectIssue.find({ analysis: analysis._id });

        res.json({
            ...analysis.toObject(),
            id: analysis._id,
            quality_score: analysis.qualityScore,
            architecture: JSON.stringify(analysis.architecture), // Backward compatibility for UI JSON.parse
            issues: dbIssues.map(i => ({
                ...i.toObject(),
                file_path: i.filePath,
                line_number: i.lineNumber,
                suggested_fix: i.suggestedFix,
                root_cause: i.rootCause
            })),
            files: dbFiles.map(f => ({
                ...f.toObject(),
                imports: JSON.stringify(f.imports),
                exports: JSON.stringify(f.exports)
            })),
            relationships: analysis.relationships,
            dataFlow: analysis.dataFlow,
            recommendations: analysis.recommendations,
            securityFindings: analysis.securityFindings,
            modules: analysis.modules,
            performanceMetrics: analysis.performanceMetrics
        });
    } catch (err) {
        console.error('[ProjectIntelligence] Analyze error:', err);
        res.status(500).json({ error: err.message || 'Full project analysis failed' });
    }
});

// ==========================================
// LIST ANALYSES
// ==========================================
router.get('/', verifyToken, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const analyses = await ProjectAnalysis.find(query)
            .populate('project', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const mapped = analyses.map(a => ({
            ...a.toObject(),
            id: a._id,
            project_name: a.project?.name || a.projectName || 'Project',
            architecture: JSON.stringify(a.architecture),
            created_at: a.createdAt,
            issue_count: a.issueCount,
            file_count: a.fileCount
        }));

        res.json(mapped);
    } catch (err) {
        console.error('[ProjectIntelligence] Fetch analyses error:', err);
        res.status(500).json({ error: 'Failed to fetch project analyses' });
    }
});

// ==========================================
// GET SAVED HISTORICAL ANALYSIS (NO RE-RUNNING GEMINI)
// ==========================================
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const analysis = await ProjectAnalysis.findById(req.params.id)
            .populate('project', 'name owner')
            .populate('user', 'name email');

        if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

        const analysisUserId = analysis.user?._id ? analysis.user._id.toString() : analysis.user?.toString();
        if (req.user.role !== 'admin' && analysisUserId && analysisUserId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const [dbFiles, dbIssues] = await Promise.all([
            ProjectFile.find({ analysis: analysis._id }),
            ProjectIssue.find({ analysis: analysis._id })
        ]);

        res.json({
            ...analysis.toObject(),
            id: analysis._id,
            quality_score: analysis.qualityScore,
            project_name: analysis.project?.name || analysis.projectName,
            architecture: JSON.stringify(analysis.architecture),
            issues: dbIssues.map(i => ({
                ...i.toObject(),
                file_path: i.filePath,
                line_number: i.lineNumber,
                suggested_fix: i.suggestedFix,
                root_cause: i.rootCause
            })),
            files: dbFiles.map(f => ({
                ...f.toObject(),
                imports: JSON.stringify(f.imports),
                exports: JSON.stringify(f.exports)
            })),
            relationships: analysis.relationships,
            dataFlow: analysis.dataFlow,
            recommendations: analysis.recommendations,
            securityFindings: analysis.securityFindings,
            modules: analysis.modules
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve saved project analysis' });
    }
});

module.exports = router;
