const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
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
    path: {
        type: String,
        required: [true, 'File path is required']
    },
    language: {
        type: String,
        default: 'Unknown'
    },
    size: {
        type: Number,
        default: 0
    },
    imports: {
        type: [String],
        default: []
    },
    exports: {
        type: [String],
        default: []
    },
    metrics: {
        totalLines: { type: Number, default: 0 },
        codeLines: { type: Number, default: 0 },
        commentLines: { type: Number, default: 0 },
        blankLines: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

projectFileSchema.index({ project: 1, path: 1 });

module.exports = mongoose.model('ProjectFile', projectFileSchema);
