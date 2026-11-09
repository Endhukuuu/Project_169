const { ActivityLog, Notification, User } = require('../models');

/**
 * Log an activity event in the database
 */
const logActivity = async (userId, action, details, options = {}) => {
    try {
        let userName = options.userName;
        let userEmail = options.userEmail;

        if ((!userName || !userEmail) && userId) {
            const user = await User.findById(userId).select('name email');
            if (user) {
                userName = user.name;
                userEmail = user.email;
            }
        }

        return await ActivityLog.create({
            user: userId,
            userName: userName || 'System User',
            userEmail: userEmail || '',
            action,
            details: details || '',
            project: options.projectId || options.project || null,
            projectName: options.projectName || '',
            metadata: options.metadata || {}
        });
    } catch (err) {
        console.error('[ActivityService] Failed to log activity:', err.message);
        return null;
    }
};

/**
 * Send an in-app notification to a user
 */
const sendNotification = async (userId, title, message, type = 'info', link = '') => {
    try {
        if (!userId) return null;
        return await Notification.create({
            user: userId,
            title,
            message,
            type,
            link
        });
    } catch (err) {
        console.error('[ActivityService] Failed to send notification:', err.message);
        return null;
    }
};

module.exports = {
    logActivity,
    sendNotification
};
