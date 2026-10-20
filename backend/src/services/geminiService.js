const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
// We'll initialize it lazily or check if available
let ai = null;

const initGemini = () => {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        return true;
    }
    return false;
};

const getModel = () => {
    if (!ai) {
        if (!initGemini()) {
            throw new Error('Gemini API key is not configured');
        }
    }
    return ai;
};

// Analysis Prompt
const analyzeCodePrompt = (code, language, description) => `
You are an expert software architect and security analyst.
Analyze the following ${language} code. 
${description ? `Additional Context: ${description}` : ''}

Respond ONLY with a valid JSON object strictly matching this structure:
{
  "summary": "High-level summary of what the code does",
  "intent": "The likely intended functionality",
  "qualityScore": 85,
  "complexity": {
    "time": "e.g., O(n)",
    "space": "e.g., O(1)"
  },
  "issues": [
    {
      "title": "Short issue title",
      "severity": "Critical|High|Medium|Low|Informational",
      "explanation": "Why this is an issue",
      "root_cause": "The root cause in the code",
      "suggested_fix": "How to fix it",
      "corrected_code": "Snippet of corrected code (optional)"
    }
  ]
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`
`;

// Review Prompt
const reviewCodePrompt = (code, language, description) => `
You are a senior principal engineer performing a code review.
Review the following ${language} code for correctness, readability, maintainability, performance, security, and best practices.
${description ? `Context/Requirements: ${description}` : ''}

Respond ONLY with a valid JSON object strictly matching this structure:
{
  "score": 80,
  "strengths": ["list of good things", "another good thing"],
  "problems": ["list of bad things"],
  "recommendations": ["how to improve"],
  "issues": [
    {
      "title": "Short problem title",
      "severity": "Critical|High|Medium|Low|Informational",
      "explanation": "Detailed review comment",
      "root_cause": "Why this fails best practices or correctness",
      "suggested_fix": "Actionable advice",
      "corrected_code": "Code snippet"
    }
  ]
}

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;

const parseJSONResponse = (text) => {
    try {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response", e);
        return {};
    }
};

const generateContentWithRetry = async (model, prompt, retries = 3, timeoutMs = 45000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs));
            return await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]);
        } catch (e) {
            if (i === retries - 1) throw e;
            console.warn(`AI request failed (attempt ${i+1}): ${e.message}, retrying in 2s...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
};

const analyzeCode = async (code, language, description) => {
    const aiClient = getModel();
    const prompt = analyzeCodePrompt(code, language, description);
    
    const model = aiClient.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        generationConfig: { temperature: 0.1 }
    });
    
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
};

const reviewCode = async (code, language, description) => {
    const aiClient = getModel();
    const prompt = reviewCodePrompt(code, language, description);
    
    const model = aiClient.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        generationConfig: { temperature: 0.1 }
    });
    
    const result = await model.generateContent(prompt);
    return parseJSONResponse(result.response.text());
};

// Project Intelligence Pipeline Prompts
const projectManifestPrompt = (manifest) => `
You are a senior software architect. Analyze the provided project manifest (file structure).
Identify the main architecture, modules, and primary responsibilities.

Manifest:
${JSON.stringify(manifest, null, 2)}

Respond ONLY with a valid JSON object strictly matching this structure:
{
  "projectSummary": "Overall summary of what this project does",
  "architecture": {
    "pattern": "e.g., MVC, Microservices, Client-Server",
    "frontend": "Frontend details if applicable",
    "backend": "Backend details if applicable",
    "database": "Database details if applicable"
  },
  "modules": [
    {
      "name": "Module name (e.g., Auth, UI)",
      "description": "What it does"
    }
  ]
}
`;

const analyzeFileBatchPrompt = (batch, manifest) => `
You are a senior code reviewer and security auditor.
Analyze the following batch of source code files from a project.
Check file references carefully. If a file imports a module, verify if it seems correct. 
Extract the imports and exports for each file.

Files:
${JSON.stringify(batch, null, 2)}

Respond ONLY with a valid JSON object strictly matching this structure:
{
  "fileDetails": [
    {
      "path": "Path of the file",
      "imports": ["moduleA", "./localModuleB"],
      "exports": ["functionX", "ClassY"]
    }
  ],
  "issues": [
    {
      "title": "Short issue title",
      "severity": "Critical|High|Medium|Low|Informational",
      "category": "Security|Performance|Maintainability|Architecture|Bug",
      "file_path": "Path of the file",
      "line_number": "Approximate line or 'File-level issue' if unavailable",
      "description": "Detailed explanation",
      "root_cause": "Root cause",
      "impact": "Impact if not fixed",
      "suggested_fix": "How to fix"
    }
  ],
  "securityFindings": [
    "List of any high-level security concerns found in these files"
  ]
}
`;

const crossFileAnalysisPrompt = (manifest, architecture, batchResults) => `
You are a Principal Engineer reviewing an entire software project.
You have the project architecture, file details (imports/exports), and the list of issues found in individual files.
Synthesize this into a final project report. 
CRITICAL: Identify meaningful cross-file problems. For example:
- A file imports a function that is not exported.
- A referenced module does not exist in the project manifest.
- Frontend calls an API endpoint that cannot be matched to the backend.

Manifest: ${JSON.stringify(manifest)}
Architecture: ${JSON.stringify(architecture)}
File Details: ${JSON.stringify(batchResults.flatMap(b => b.fileDetails))}
File Issues: ${JSON.stringify(batchResults.flatMap(b => b.issues))}

Respond ONLY with a valid JSON object strictly matching this structure:
{
  "relationships": ["e.g., frontend/src/api.js calls backend/routes/api.js", "Login.jsx imports authService.js"],
  "dataFlow": "Description of how data flows through the project",
  "qualityScore": 85,
  "crossFileIssues": [
    {
      "title": "Short title",
      "severity": "Critical|High|Medium|Low|Informational",
      "category": "Architecture|Integration|Security|Missing File Reference",
      "file_path": "Cross-file or specific path",
      "line_number": "File-level issue",
      "description": "Detailed explanation of the cross-file inconsistency",
      "root_cause": "Root cause",
      "impact": "Impact",
      "suggested_fix": "How to fix"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;

const analyzeFullProjectPipeline = async (manifest, files) => {
    const aiClient = getModel();
    const model = aiClient.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        generationConfig: { temperature: 0.1 }
    });

    // 1. Architecture from Manifest
    let architectureResult;
    try {
        const archResponse = await generateContentWithRetry(model, projectManifestPrompt(manifest));
        architectureResult = parseJSONResponse(archResponse.response.text());
    } catch (e) {
        console.error("Architecture analysis failed", e);
        architectureResult = { projectSummary: "Unknown", architecture: {}, modules: [] };
    }

    // 2. Batch Analysis (Chunks of 5 files to avoid massive prompts, ignoring huge files)
    const batchResults = [];
    const chunkSize = 5;
    for (let i = 0; i < files.length; i += chunkSize) {
        const batch = files.slice(i, i + chunkSize).map(f => ({ path: f.path, content: f.content.substring(0, 15000) })); // truncate massive files
        try {
            const batchRes = await generateContentWithRetry(model, analyzeFileBatchPrompt(batch));
            batchResults.push(parseJSONResponse(batchRes.response.text()));
        } catch (e) {
            console.error("Batch analysis failed", e);
            batchResults.push({ issues: [], securityFindings: [] });
        }
    }

    // 3. Cross-file Synthesis
    let synthesisResult;
    try {
        const synthRes = await generateContentWithRetry(model, crossFileAnalysisPrompt(manifest, architectureResult, batchResults));
        synthesisResult = parseJSONResponse(synthRes.response.text());
    } catch (e) {
        console.error("Synthesis failed", e);
        synthesisResult = { relationships: [], dataFlow: "Unknown", qualityScore: 50, crossFileIssues: [], recommendations: [] };
    }

    // Combine all issues
    const allIssues = [
        ...batchResults.flatMap(b => b.issues || []),
        ...synthesisResult.crossFileIssues || []
    ];
    
    const securityFindings = batchResults.flatMap(b => b.securityFindings || []);
    const fileDetails = batchResults.flatMap(b => b.fileDetails || []);

    return {
        ...architectureResult,
        ...synthesisResult,
        issues: allIssues,
        securityFindings,
        fileDetails
    };
};

module.exports = {
    initGemini,
    analyzeCode,
    reviewCode,
    analyzeFullProjectPipeline
};
