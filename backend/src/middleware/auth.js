const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'udih_enterprise_jwt_secure_secret_key_2026_x89a';

/**
 * Verify JWT token and attach user to request object
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists.' });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ error: 'Your account has been deactivated. Please contact an administrator.' });
        }

        // Update lastActive timestamp asynchronously without blocking
        User.findByIdAndUpdate(user._id, { lastActive: new Date() }).exec().catch(() => {});

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ error: 'Invalid authentication token.' });
    }
};

/**
 * Require administrator role
 */
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
};

/**
 * Optional token verification (attaches user if present, otherwise continues)
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user && user.status === 'active') {
                req.user = user;
            }
        }
    } catch (_) {}
    next();
};

module.exports = {
    verifyToken,
    requireAdmin,
    optionalAuth
};
