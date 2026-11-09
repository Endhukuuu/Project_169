const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { logActivity, sendNotification } = require('../services/activityService');

const JWT_SECRET = process.env.JWT_SECRET || 'udih_enterprise_jwt_secure_secret_key_2026_x89a';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// --- Registration ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email address already exists' });
        }

        // Security rule: public registration ALWAYS defaults to 'developer' role.
        // Admin accounts can never be created via public registration.
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'developer',
            status: 'active'
        });

        const token = generateToken(user);

        // Activity log & notification
        await logActivity(user._id, 'USER_REGISTERED', 'New developer account registered', {
            userName: user.name,
            userEmail: user.email
        });

        await sendNotification(
            user._id,
            'Welcome to UDIH!',
            'Your developer intelligence account is active. Start by uploading a project or running a code review.',
            'info'
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('[Auth] Registration error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = (email || '').toLowerCase().trim();
        const user = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ error: 'Your account has been deactivated. Please contact an administrator.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update lastActive timestamp immediately
        await User.updateOne({ _id: user._id }, { lastActive: new Date() });

        const token = generateToken(user);

        // Activity log
        await logActivity(user._id, 'LOGIN', 'User logged in to platform', {
            userName: user.name,
            userEmail: user.email
        });

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ error: 'Login failed. Please check credentials and try again.' });
    }
});

// --- Current User Profile ---
router.get('/me', verifyToken, async (req, res) => {
    res.json({
        user: req.user.toJSON()
    });
});

// --- Forgot Password Workflow ---
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            // Return success anyway for security so attackers cannot enumerate registered emails
            return res.json({ message: 'If an account exists with this email, password reset instructions have been generated.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        await logActivity(user._id, 'PASSWORD_RESET_REQUESTED', 'Password reset requested', {
            userEmail: user.email
        });

        res.json({
            message: 'If an account exists with this email, password reset instructions have been generated.',
            resetToken // Provided for client reset completion
        });
    } catch (err) {
        console.error('[Auth] Forgot password error:', err);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
});

// --- Reset Password ---
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        await logActivity(user._id, 'PASSWORD_RESET_COMPLETED', 'Password was successfully reset', {
            userEmail: user.email
        });

        res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (err) {
        console.error('[Auth] Reset password error:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// --- Heartbeat Ping to maintain Online presence ---
router.get('/ping', verifyToken, async (req, res) => {
    try {
        await User.updateOne({ _id: req.user._id }, { lastActive: new Date() });
        res.json({ ok: true, isOnline: true });
    } catch (_) {
        res.status(500).json({ ok: false });
    }
});

// --- Logout ---
router.post('/logout', verifyToken, async (req, res) => {
    try {
        // Set lastActive to epoch 0 so the user immediately appears OFFLINE
        await User.updateOne({ _id: req.user._id }, { lastActive: new Date(0) });
        await logActivity(req.user._id, 'LOGOUT', 'User logged out', {
            userName: req.user.name,
            userEmail: req.user.email
        });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;
