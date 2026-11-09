const mongoose = require('mongoose');

const projectIssueSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project reference is required'],
        index: true
    },
    analysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectAnalysis',
        index: true
    },
    title: {
        type: String,
        required: [true, 'Issue title is required'],
        trim: true
    },
    severity: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
        default: 'Medium',
        index: true
    },
    category: {
        type: String,
        default: 'Maintainability',
        index: true
    },
    filePath: {
        type: String,
        default: 'Project'
    },
    lineNumber: {
        type: String,
        default: 'File-level issue'
    },
    description: {
        type: String,
        default: ''
    },
    rootCause: {
        type: String,
        default: ''
    },
    impact: {
        type: String,
        default: ''
    },
    suggestedFix: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

projectIssueSchema.index({ project: 1, severity: 1 });

module.exports = mongoose.model('ProjectIssue', projectIssueSchema);
