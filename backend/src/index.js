require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initGemini } = require('./services/geminiService');
const { seedAdmin } = require('./services/adminSeeder');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const piRoutes = require('./routes/projectIntelligence');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/project-intelligence', piRoutes);
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'An internal server error occurred.' 
            : (err.message || 'Internal Server Error')
    });
});

const startServer = async () => {
    try {
        // Connect to MongoDB Atlas
        await connectDB();

        // Seed initial administrator & migrate legacy SQLite data if needed
        await seedAdmin();

        // Initialize Gemini AI integration
        const aiStatus = initGemini();
        console.log(`[AI Engine] Google Gemini Status: ${aiStatus ? 'Configured & Online' : 'Missing API Key'}`);

        app.listen(PORT, () => {
            console.log(`=======================================================`);
            console.log(`UDIH Multi-User Platform Server running on port ${PORT}`);
            console.log(`API Base URL: http://localhost:${PORT}/api`);
            console.log(`=======================================================`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

module.exports = app;

if (require.main === module) {
    startServer();
}
