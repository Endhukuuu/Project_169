const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const db = require('../services/dbService');
const ai = require('../services/geminiService');

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

router.post('/upload', upload.single('project'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const zip = new AdmZip(req.file.path);
        const zipEntries = zip.getEntries();
        
        let files = [];
        let folders = new Set();
        let languages = new Set();

        zipEntries.forEach(zipEntry => {
            if (shouldIgnore(zipEntry.entryName)) return;

            if (zipEntry.isDirectory) {
                folders.add(zipEntry.entryName);
            } else {
                const parts = zipEntry.entryName.split('/');
                if (parts.length > 1) {
                    // add intermediate folders just in case
                    for (let i=1; i<parts.length; i++) {
                        folders.add(parts.slice(0, i).join('/') + '/');
                    }
                }
                
                const lang = getLanguageFromExt(zipEntry.entryName);
                if (lang !== 'Unknown') languages.add(lang);

                // Read text content
                let content = '';
                try {
                    content = zipEntry.getData().toString('utf8');
                } catch(e) {} // ignore unreadable binary if slipped through

                if (content.trim()) {
                    files.push({
                        path: zipEntry.entryName,
                        language: lang,
                        size: zipEntry.header.size,
                        content: content
                    });
                }
            }
        });

        // Clean up zip
        fs.unlinkSync(req.file.path);

        const manifest = {
            projectName: req.body.projectName || req.file.originalname.replace('.zip', ''),
            fileCount: files.length,
            folderCount: folders.size,
            languages: Array.from(languages),
            files: files.map(f => ({ path: f.path, language: f.language, size: f.size }))
        };

        res.json({ manifest, extractedFiles: files });
    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to process project ZIP' });
    }
});

router.post('/analyze', async (req, res) => {
    try {
        const { projectId, manifest, files } = req.body;
        if (!manifest || !files) {
            return res.status(400).json({ error: 'Manifest and files are required' });
        }

        // Run full AI pipeline
        const report = await ai.analyzeFullProjectPipeline(manifest, files);

        // Save to DB
        const result = await db.run(`
            INSERT INTO project_analyses (project_id, summary, architecture, quality_score, languages, status)
            VALUES (?, ?, ?, ?, ?, 'Completed')
        `, [
            projectId || null,
            report.projectSummary,
            JSON.stringify(report.architecture || {}),
            report.qualityScore || 0,
            JSON.stringify(manifest.languages)
        ]);

        const piId = result.id;

        // Save manifest files with imports/exports
        for (const f of manifest.files) {
            const details = report.fileDetails?.find(d => d.path === f.path) || {};
            const importsStr = details.imports ? JSON.stringify(details.imports) : null;
            const exportsStr = details.exports ? JSON.stringify(details.exports) : null;
            
            await db.run(`
                INSERT INTO project_analysis_files (pi_id, path, language, size, imports, exports)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [piId, f.path, f.language, f.size, importsStr, exportsStr]);
        }

        // Save issues
        if (report.issues && report.issues.length > 0) {
            for (const issue of report.issues) {
                await db.run(`
                    INSERT INTO project_analysis_issues (pi_id, title, severity, category, file_path, line_number, description, root_cause, impact, suggested_fix)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    piId, issue.title, issue.severity, issue.category, issue.file_path, issue.line_number, 
                    issue.description, issue.root_cause, issue.impact, issue.suggested_fix
                ]);
            }
        }

        const fullAnalysis = await db.get('SELECT * FROM project_analyses WHERE id = ?', [piId]);
        const dbIssues = await db.all('SELECT * FROM project_analysis_issues WHERE pi_id = ?', [piId]);
        const dbFiles = await db.all('SELECT * FROM project_analysis_files WHERE pi_id = ?', [piId]);

        res.json({ 
            ...fullAnalysis, 
            issues: dbIssues, 
            files: dbFiles, 
            relationships: report.relationships, 
            dataFlow: report.dataFlow,
            recommendations: report.recommendations,
            securityFindings: report.securityFindings,
            modules: report.modules
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Full project analysis failed' });
    }
});

router.get('/', async (req, res) => {
    try {
        const analyses = await db.all(`
            SELECT pa.*, p.name as project_name 
            FROM project_analyses pa 
            LEFT JOIN projects p ON pa.project_id = p.id 
            ORDER BY pa.created_at DESC
        `);
        for (let a of analyses) {
            const count = await db.get('SELECT count(*) as c FROM project_analysis_issues WHERE pi_id = ?', [a.id]);
            a.issue_count = count.c;
            const countFiles = await db.get('SELECT count(*) as c FROM project_analysis_files WHERE pi_id = ?', [a.id]);
            a.file_count = countFiles.c;
        }
        res.json(analyses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project analyses' });
    }
});

module.exports = router;
