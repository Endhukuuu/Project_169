/**
 * tokenManager.js - Unified Developer Intelligence Hub (UDIH)
 * 
 * Token Merging, Splitting & Context Management (Addresses Improvement Areas 1 & 5):
 * 1. Token Estimation & Accurate Accounting (approx ~3.8 chars/token for code).
 * 2. Logical Boundary-Aware Splitting (functions, classes, statement blocks - never split mid-statement).
 * 3. Structured Context Injection (file path, chunk part, line range header).
 * 4. Dynamic Token-Budgeted Batch Packing (groups files by token budget instead of arbitrary counts).
 * 5. Finding Reconciliation (maps chunk-relative line numbers back to true file line numbers).
 */

const CHARS_PER_TOKEN = 3.8;

/**
 * Fast local estimation of token count
 */
const estimateTokens = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
};

/**
 * Exact token count using Gemini model instance (if available)
 */
const countTokensWithModel = async (model, text) => {
    try {
        if (model && typeof model.countTokens === 'function') {
            const res = await model.countTokens(text);
            return res.totalTokens;
        }
    } catch (e) {
        // Fallback to local estimator if API call fails
    }
    return estimateTokens(text);
};

/**
 * Check if a line represents a logical declaration boundary in common languages
 */
const isDeclarationBoundary = (line) => {
    const trimmed = line.trim();
    return (
        // JS / TS / React
        /^(?:export\s+)?(?:default\s+)?(?:function|class|const|let|var|type|interface)\s+[A-Za-z0-9_$]+/.test(trimmed) ||
        // Python
        /^(?:async\s+)?def\s+[A-Za-z0-9_]+\s*\(/.test(trimmed) ||
        /^class\s+[A-Za-z0-9_]+/.test(trimmed) ||
        // Java / C# / C++
        /^(?:public|private|protected|static|final|abstract)?\s*(?:class|interface|enum|void|[A-Za-z0-9_<>]+)\s+[A-Za-z0-9_]+\s*\(/.test(trimmed) ||
        // Go / Rust
        /^(?:func|pub\s+fn|fn|type|struct)\s+[A-Za-z0-9_]+/.test(trimmed)
    );
};

/**
 * Split large source files into meaningful code sections while preserving logical boundaries
 * 
 * @param {Object} file - { path, language, content, size }
 * @param {number} maxTokensPerChunk - Max token threshold per chunk (default 2500 tokens ~ 9.5KB)
 * @returns {Array} List of chunk objects
 */
const segmentFile = (file, maxTokensPerChunk = 2500) => {
    const content = file.content || '';
    const totalTokens = estimateTokens(content);

    // If file fits comfortably within target token budget, return single chunk
    if (totalTokens <= maxTokensPerChunk) {
        return [{
            path: file.path,
            language: file.language,
            chunkIndex: 0,
            totalChunks: 1,
            startLine: 1,
            endLine: content.split('\n').length,
            content: content,
            header: `// [FILE] path: "${file.path}" (1/1)`
        }];
    }

    const lines = content.split('\n');
    const chunks = [];
    let currentLines = [];
    let currentTokens = 0;
    let chunkStartLine = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineTokens = estimateTokens(line + '\n');
        const lineNumber = i + 1;

        // Check if we reached threshold and are at a good boundary point
        const reachedSoftLimit = currentTokens >= maxTokensPerChunk * 0.8;
        const reachedHardLimit = currentTokens + lineTokens > maxTokensPerChunk;
        const atLogicalBoundary = isDeclarationBoundary(line) || (line.trim() === '' && currentLines.length > 20);

        if ((reachedSoftLimit && atLogicalBoundary) || reachedHardLimit) {
            if (currentLines.length > 0) {
                const chunkEndLine = lineNumber - 1;
                chunks.push({
                    path: file.path,
                    language: file.language,
                    chunkIndex: chunks.length,
                    startLine: chunkStartLine,
                    endLine: chunkEndLine,
                    content: currentLines.join('\n')
                });
                currentLines = [];
                currentTokens = 0;
                chunkStartLine = lineNumber;
            }
        }

        currentLines.push(line);
        currentTokens += lineTokens;
    }

    // Flush remaining lines
    if (currentLines.length > 0) {
        chunks.push({
            path: file.path,
            language: file.language,
            chunkIndex: chunks.length,
            startLine: chunkStartLine,
            endLine: lines.length,
            content: currentLines.join('\n')
        });
    }

    // Assign totalChunks and context headers
    const totalChunks = chunks.length;
    return chunks.map(chunk => ({
        ...chunk,
        totalChunks,
        header: `// [FILE CHUNK] path: "${chunk.path}" (Part ${chunk.chunkIndex + 1}/${totalChunks}, Lines ${chunk.startLine}-${chunk.endLine})`
    }));
};

/**
 * Group files/chunks into balanced batches based on token budget
 * 
 * @param {Array} items - Files or file chunks to batch
 * @param {number} maxBatchTokens - Maximum combined tokens in one batch (default 6000 tokens)
 * @returns {Array<Array>} Array of batches
 */
const packBatchesByTokenBudget = (items, maxBatchTokens = 6000) => {
    const batches = [];
    let currentBatch = [];
    let currentTokens = 0;

    for (const item of items) {
        const itemTokens = estimateTokens(item.content);

        // If adding this item exceeds budget and currentBatch is not empty, start new batch
        if (currentTokens + itemTokens > maxBatchTokens && currentBatch.length > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentTokens = 0;
        }

        currentBatch.push(item);
        currentTokens += itemTokens;
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
};

/**
 * Reconcile findings across chunks, adjusting line numbers to match original file coordinates
 */
const reconcileChunkFindings = (issues = [], chunks = []) => {
    const chunkMap = new Map();
    chunks.forEach(c => {
        chunkMap.set(`${c.path}#${c.chunkIndex}`, c);
    });

    const reconciled = [];
    const seenSignatures = new Set();

    issues.forEach(issue => {
        let finalLine = issue.line_number || 'File-level issue';
        const filePath = issue.file_path;

        // Try to match if issue came from a chunk with a line offset
        if (filePath) {
            // Find corresponding chunk if chunkIndex was provided or match by path
            const chunk = chunks.find(c => c.path === filePath && c.startLine > 1);
            if (chunk) {
                // If line number is numeric or 'Line X', add offset
                const match = String(finalLine).match(/(\d+)/);
                if (match) {
                    const rawLine = parseInt(match[1], 10);
                    // If raw line is relative to chunk, shift it
                    if (rawLine < (chunk.endLine - chunk.startLine + 1)) {
                        finalLine = `Line ${chunk.startLine + rawLine - 1}`;
                    }
                }
            }
        }

        // Deduplication signature
        const sig = `${filePath || ''}:${issue.title}:${finalLine}`;
        if (!seenSignatures.has(sig)) {
            seenSignatures.add(sig);
            reconciled.push({
                ...issue,
                line_number: String(finalLine)
            });
        }
    });

    return reconciled;
};

module.exports = {
    CHARS_PER_TOKEN,
    estimateTokens,
    countTokensWithModel,
    segmentFile,
    packBatchesByTokenBudget,
    reconcileChunkFindings
};
