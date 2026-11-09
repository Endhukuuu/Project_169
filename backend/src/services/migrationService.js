const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { User, Project, ProjectAnalysis, ProjectFile, ProjectIssue, CodeReview, SingleAnalysis, ActivityLog } = require('../models');

const sqliteDbPath = path.resolve(__dirname, '../../database.sqlite');

const migrateFromSqlite = async (adminUser) => {
    if (!fs.existsSync(sqliteDbPath)) {
        console.log('[Migration] No SQLite database file found to migrate.');
        return;
    }

    // Check if migration already ran (e.g. if projects already exist)
    const existingProjectsCount = await Project.countDocuments();
    if (existingProjectsCount > 0) {
        // Already populated, skip to prevent duplicates
        return;
    }

    console.log('[Migration] Starting automatic data migration from SQLite to MongoDB Atlas...');

    const db = new sqlite3.Database(sqliteDbPath);

    const queryAll = (sql) => new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) resolve([]); // table might not exist
            else resolve(rows || []);
        });
    });

    try {
        const sqliteProjects = await queryAll('SELECT * FROM projects');
        const projectMap = new Map(); // sqliteId -> mongoId

        for (const sp of sqliteProjects) {
            const mp = await Project.create({
                name: sp.name,
                description: sp.description || '',
                owner: adminUser._id,
                languages: sp.language ? [sp.language] : [],
                status: 'active',
                createdAt: sp.created_at ? new Date(sp.created_at) : new Date()
            });
            projectMap.set(sp.id, mp._id);
        }

        // Migrate Single Analyses
        const sqliteAnalyses = await queryAll('SELECT * FROM analyses');
        for (const sa of sqliteAnalyses) {
            const mongoProjectId = projectMap.get(sa.project_id) || null;
            const issues = await queryAll(`SELECT * FROM analysis_issues WHERE analysis_id = ${sa.id}`);
            await SingleAnalysis.create({
                project: mongoProjectId,
                user: adminUser._id,
                codeSnippet: sa.code_snippet,
                language: sa.language,
                qualityScore: sa.quality_score || 80,
                intent: sa.intent || '',
                summary: sa.summary || '',
                complexity: {
                    time: sa.complexity_time || 'N/A',
                    space: sa.complexity_space || 'N/A'
                },
                issues: issues.map(i => ({
                    title: i.title,
                    severity: i.severity || 'Medium',
                    explanation: i.explanation || '',
                    rootCause: i.root_cause || '',
                    suggestedFix: i.suggested_fix || '',
                    correctedCode: i.corrected_code || null
                })),
                createdAt: sa.created_at ? new Date(sa.created_at) : new Date()
            });
        }

        // Migrate Code Reviews
        const sqliteReviews = await queryAll('SELECT * FROM reviews');
        for (const sr of sqliteReviews) {
            const mongoProjectId = projectMap.get(sr.project_id) || null;
            const comments = await queryAll(`SELECT * FROM review_comments WHERE review_id = ${sr.id}`);
            await CodeReview.create({
                project: mongoProjectId,
                user: adminUser._id,
                title: sr.title,
                description: sr.description || '',
                codeSnippet: sr.code_snippet,
                language: sr.language,
                score: sr.score || 80,
                status: sr.status || 'In Review',
                comments: comments.map(c => ({
                    user: adminUser._id,
                    userName: adminUser.name,
                    content: c.content,
                    status: c.status || 'Open',
                    createdAt: c.created_at ? new Date(c.created_at) : new Date()
                })),
                createdAt: sr.created_at ? new Date(sr.created_at) : new Date()
            });
        }

        // Migrate Project Intelligence Analyses
        const sqlitePIAnalyses = await queryAll('SELECT * FROM project_analyses');
        for (const spi of sqlitePIAnalyses) {
            const mongoProjectId = projectMap.get(spi.project_id) || null;
            let arch = { pattern: 'Client-Server' };
            try { arch = JSON.parse(spi.architecture || '{}'); } catch(e) {}
            let langs = [];
            try { langs = JSON.parse(spi.languages || '[]'); } catch(e) {}

            const mpi = await ProjectAnalysis.create({
                project: mongoProjectId || (await Project.findOne({ owner: adminUser._id }))?._id || null,
                user: adminUser._id,
                summary: spi.summary || '',
                architecture: arch,
                qualityScore: spi.quality_score || 70,
                languages: langs,
                status: spi.status || 'Completed',
                createdAt: spi.created_at ? new Date(spi.created_at) : new Date()
            });

            // Files
            const files = await queryAll(`SELECT * FROM project_analysis_files WHERE pi_id = ${spi.id}`);
            for (const f of files) {
                let imports = [];
                let exports = [];
                try { imports = JSON.parse(f.imports || '[]'); } catch(e) {}
                try { exports = JSON.parse(f.exports || '[]'); } catch(e) {}
                await ProjectFile.create({
                    project: mpi.project,
                    analysis: mpi._id,
                    path: f.path,
                    language: f.language,
                    size: f.size || 0,
                    imports,
                    exports
                });
            }

            // Issues
            const issues = await queryAll(`SELECT * FROM project_analysis_issues WHERE pi_id = ${spi.id}`);
            for (const iss of issues) {
                await ProjectIssue.create({
                    project: mpi.project,
                    analysis: mpi._id,
                    title: iss.title,
                    severity: iss.severity || 'Medium',
                    category: iss.category || 'Maintainability',
                    filePath: iss.file_path || 'Project',
                    lineNumber: iss.line_number || 'File-level issue',
                    description: iss.description || '',
                    rootCause: iss.root_cause || '',
                    impact: iss.impact || '',
                    suggestedFix: iss.suggested_fix || ''
                });
            }
        }

        console.log(`[Migration] Successfully migrated SQLite records to MongoDB Atlas under admin account (${adminUser.email}).`);
    } catch (err) {
        console.error('[Migration] Migration error:', err.message);
    } finally {
        db.close();
    }
};

module.exports = {
    migrateFromSqlite
};
