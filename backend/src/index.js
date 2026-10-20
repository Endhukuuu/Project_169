require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./services/dbService');
const { initGemini } = require('./services/geminiService');
const apiRoutes = require('./routes/api');
const piRoutes = require('./routes/projectIntelligence');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased for large batch arrays

app.use('/api/project-intelligence', piRoutes);
app.use('/api', apiRoutes);

const startServer = async () => {
    try {
        await initDb();
        console.log('Database initialized.');
        
        const aiStatus = initGemini();
        console.log(`Gemini API Status: ${aiStatus ? 'Configured' : 'Missing API Key'}`);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();
