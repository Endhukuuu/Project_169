const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [150, 'Project name cannot exceed 150 characters']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project owner is required'],
        index: true
    },
    languages: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    fileCount: {
        type: Number,
        default: 0
    },
    folderCount: {
        type: Number,
        default: 0
    },
    totalSize: {
        type: Number,
        default: 0
    },
    lastAnalyzedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
