const mongoose = require('mongoose');

const singleAnalysisSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true
    },
    codeSnippet: {
        type: String,
        required: [true, 'Code snippet is required']
    },
    language: {
        type: String,
        required: [true, 'Language is required']
    },
    qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    intent: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        default: ''
    },
    complexity: {
        time: { type: String, default: 'N/A' },
        space: { type: String, default: 'N/A' }
    },
    issues: [{
        title: String,
        severity: {
            type: String,
            enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
            default: 'Medium'
        },
        explanation: String,
        rootCause: String,
        suggestedFix: String,
        correctedCode: String
    }]
}, {
    timestamps: true
});

singleAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SingleAnalysis', singleAnalysisSchema);
