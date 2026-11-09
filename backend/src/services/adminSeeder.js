const { User } = require('../models');
const { logActivity } = require('./activityService');
const { migrateFromSqlite } = require('./migrationService');

/**
 * Seed initial administrator account if no admin exists
 */
const seedAdmin = async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@udih.dev').toLowerCase().trim();
        const adminName = process.env.ADMIN_NAME || 'Platform Administrator';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@UDIH2026!';

        // Check if ANY admin exists in DB
        let admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log(`[AdminSeeder] No administrator found. Initializing primary admin (${adminEmail})...`);
            
            // Check if user with this email already exists
            const existingUser = await User.findOne({ email: adminEmail });
            if (existingUser) {
                existingUser.role = 'admin';
                existingUser.status = 'active';
                await existingUser.save();
                admin = existingUser;
            } else {
                admin = await User.create({
                    name: adminName,
                    email: adminEmail,
                    password: adminPassword,
                    role: 'admin',
                    status: 'active'
                });
            }

            console.log(`[AdminSeeder] Primary administrator created successfully: ${admin.email}`);
            await logActivity(admin._id, 'INITIAL_ADMIN_CREATED', 'Primary system administrator account initialized', {
                userName: admin.name,
                userEmail: admin.email
            });
        }

        // Run one-time migration of SQLite records if MongoDB is newly initialized
        await migrateFromSqlite(admin);

        return admin;
    } catch (err) {
        console.error('[AdminSeeder] Error during administrator seeding:', err.message);
    }
};

module.exports = { seedAdmin };
