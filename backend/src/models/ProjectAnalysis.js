const mongoose = require('mongoose');

const projectAnalysisSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project reference is required'],
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true
    },
    projectName: {
        type: String,
        default: 'Untitled Project'
    },
    summary: {
        type: String,
        default: ''
    },
    architecture: {
        pattern: { type: String, default: 'Client-Server' },
        frontend: { type: String, default: 'Not specified' },
        backend: { type: String, default: 'Not specified' },
        database: { type: String, default: 'None specified' }
    },
    qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70
    },
    languages: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        default: 'Completed'
    },
    relationships: {
        type: [String],
        default: []
    },
    dataFlow: {
        type: String,
        default: ''
    },
    recommendations: {
        type: [String],
        default: []
    },
    securityFindings: {
        type: [String],
        default: []
    },
    modules: [{
        name: String,
        description: String
    }],
    fileCount: {
        type: Number,
        default: 0
    },
    issueCount: {
        type: Number,
        default: 0
    },
    performanceMetrics: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

projectAnalysisSchema.index({ project: 1, createdAt: -1 });
projectAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectAnalysis', projectAnalysisSchema);
