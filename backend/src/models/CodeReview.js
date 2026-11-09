const mongoose = require('mongoose');

const codeReviewSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: [true, 'Review title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    codeSnippet: {
        type: String,
        required: [true, 'Code snippet is required']
    },
    language: {
        type: String,
        required: [true, 'Language is required']
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    status: {
        type: String,
        enum: ['Open', 'In Review', 'Resolved', 'Closed'],
        default: 'In Review',
        index: true
    },
    strengths: {
        type: [String],
        default: []
    },
    problems: {
        type: [String],
        default: []
    },
    recommendations: {
        type: [String],
        default: []
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
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String,
        content: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'Open'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

codeReviewSchema.index({ project: 1, createdAt: -1 });
codeReviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CodeReview', codeReviewSchema);
