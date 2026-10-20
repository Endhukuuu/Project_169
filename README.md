# Unified Developer Intelligence Hub

An AI-powered developer intelligence platform that helps developers understand, debug, review, and improve source code using Enterprise Data Analytics, Semantic Code Understanding, and AI-Powered Collaborative Code Review.

## Features

- **Enterprise Analytics Dashboard**: View high-level metrics, code quality trends, and severity distributions.
- **Project Management**: Group analyses and reviews by project.
- **Semantic Code Analyzer**: AI-powered analysis that detects bugs, potential risks, logical errors, and provides complexity metrics and structural intent.
- **Collaborative Code Review**: Request an AI code review and iterate on findings with a resolved/unresolved status workflow.
- **Strict Monochrome Design**: Professional, minimalistic black/white/gray aesthetics.
- **History Tracking**: Maintain a persistent history of all AI analyses and code reviews.

## Architecture

- **Frontend**: React 18, Vite, React Router, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **AI Integration**: Official Google Gemini API (`@google/generative-ai`)

## Prerequisites

- Node.js (v18 or higher)
- NPM

## Installation

1. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory based on `.env.example`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

1. Start the Backend:
   ```bash
   cd backend
   npm start
   ```
   *The server will start on http://localhost:5000 and initialize the SQLite database automatically.*

2. Start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   *The app will be available at http://localhost:5173.*

## API Endpoints

- `GET /api/health` - Check system status and AI provider
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `POST /api/analyze` - Trigger an AI semantic code analysis
- `GET /api/analyses` - Get analysis history
- `POST /api/reviews` - Trigger an AI code review
- `PATCH /api/reviews/:reviewId/comments/:commentId` - Mark review comment as resolved/unresolved
- `GET /api/analytics/overview` - Aggregate data for dashboard charts

## Future Enhancements
- PostgreSQL migration for heavier enterprise usage.
