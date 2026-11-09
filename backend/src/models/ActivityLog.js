const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true
    },
    userName: {
        type: String,
        default: 'User'
    },
    userEmail: {
        type: String,
        default: ''
    },
    action: {
        type: String,
        required: [true, 'Action type is required'],
        index: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    },
    projectName: {
        type: String,
        default: ''
    },
    details: {
        type: String,
        default: ''
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
