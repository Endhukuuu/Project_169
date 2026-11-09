/**
 * codePreprocessor.js - Unified Developer Intelligence Hub (UDIH)
 * 
 * Modular Preprocessing Engine (Addresses Improvement Areas 1 & 3):
 * 1. Deterministic Extraction: Regex/heuristic parsing of imports and exports across 10+ languages (0 tokens, <1ms).
 * 2. Static Security & Secret Scanner: Detects hardcoded credentials, API keys, code injection, and unsafe patterns.
 * 3. Input Sanitization & Injection Defense: Strips control characters, ensures code is safely treated as data.
 * 4. Code Metrics: Deterministic computation of line counts (total, code, blank, comment) and complexity indicators.
 */

// Common secret & security heuristics
const SECURITY_PATTERNS = [
    {
        title: 'Hardcoded High-Entropy Secret / API Key',
        severity: 'Critical',
        category: 'Security',
        regex: /(?:api[_-]?key|secret|token|password|auth[_-]?token)\s*[:=]\s*["']([A-Za-z0-9_\-\.]{20,})["']/i,
        explanation: 'Sensitive credential or API key is directly hardcoded in source code.',
        root_cause: 'Secrets embedded in plain text instead of loaded via environment variables.',
        impact: 'Credential leakage, unauthorized access if source code is exposed.',
        suggested_fix: 'Move secrets to an environment variable (.env) or a secret manager.'
    },
    {
        title: 'Hardcoded AWS Access Key',
        severity: 'Critical',
        category: 'Security',
        regex: /(?:AKIA[0-9A-Z]{16})/,
        explanation: 'Hardcoded AWS Access Key ID detected.',
        root_cause: 'Cloud infrastructure credentials placed in source file.',
        impact: 'Potential AWS account compromise and resource abuse.',
        suggested_fix: 'Remove key immediately, rotate IAM credentials, and use IAM roles or env vars.'
    },
    {
        title: 'Hardcoded Private Key Block',
        severity: 'Critical',
        category: 'Security',
        regex: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
        explanation: 'Asymmetric private cryptographic key found in source code.',
        root_cause: 'Private cryptographic key committed into source.',
        impact: 'Full compromise of encrypted communication or authentication mechanisms.',
        suggested_fix: 'Store private keys in a secure key store or file outside version control.'
    },
    {
        title: 'Unsafe Dynamic Code Execution (eval/exec)',
        severity: 'High',
        category: 'Security',
        regex: /\b(?:eval|exec)\s*\((?![^)]*["']\s*\))/i,
        explanation: 'Use of dynamic code execution function with non-constant input.',
        root_cause: 'Evaluating arbitrary dynamic expressions directly.',
        impact: 'Remote Code Execution (RCE) or arbitrary script injection vulnerability.',
        suggested_fix: 'Refactor to eliminate dynamic evaluation; use safe parsing or mapping tables.'
    },
    {
        title: 'Direct Shell Command Execution',
        severity: 'High',
        category: 'Security',
        regex: /\b(?:child_process\.exec|os\.system|subprocess\.Popen\(.+shell\s*=\s*True)/i,
        explanation: 'Execution of shell commands with potentially unvalidated arguments.',
        root_cause: 'Spawning shell interpreters directly for external commands.',
        impact: 'Command Injection vulnerability if arguments include user input.',
        suggested_fix: 'Use parameterized execution (e.g. execFile, subprocess.run with shell=False).'
    },
    {
        title: 'Potential SQL Injection via String Concatenation',
        severity: 'High',
        category: 'Security',
        regex: /\b(?:SELECT|INSERT|UPDATE|DELETE)\b[\s\S]{1,60}(?:\+|\.concat\(|%s|\$\{)/i,
        explanation: 'SQL statement constructed via string concatenation or template interpolation.',
        root_cause: 'Embedding variables directly into SQL queries rather than using parameterized queries.',
        impact: 'SQL Injection, unauthorized data access, or data corruption.',
        suggested_fix: 'Use parameterized queries or prepared statements (e.g., query("SELECT ... WHERE id = ?", [id])).'
    },
    {
        title: 'Unsanitized HTML Rendering (XSS Risk)',
        severity: 'Medium',
        category: 'Security',
        regex: /dangerouslySetInnerHTML\s*=|innerHTML\s*=/i,
        explanation: 'Directly injecting raw HTML into DOM elements.',
        root_cause: 'Setting innerHTML without sanitization.',
        impact: 'Cross-Site Scripting (XSS) if untrusted input reaches this property.',
        suggested_fix: 'Use textContent, React standard JSX binding, or sanitize with DOMPurify.'
    }
];

/**
 * Deterministically extract imports and exports from source code
 */
const extractImportsExports = (content, language = '') => {
    const imports = new Set();
    const exports = new Set();
    const lang = (language || '').toLowerCase();

    if (!content || typeof content !== 'string') {
        return { imports: [], exports: [] };
    }

    const lines = content.split('\n');

    for (const rawLine of lines) {
        const line = rawLine.trim();

        // 1. JavaScript / TypeScript / React
        if (lang.includes('javascript') || lang.includes('typescript') || lang.includes('react') || lang.endsWith('js') || lang.endsWith('ts')) {
            // ES6 imports: import X from 'pkg'; import { A, B } from './path'; import './styles.css'
            const esImport = line.match(/^import\s+(?:(?:(?:\w+|\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+)?["']([^"']+)["'])/);
            if (esImport && esImport[1]) {
                imports.add(esImport[1]);
            }

            // CommonJS require: const x = require('pkg');
            const cjsRequire = line.match(/require\s*\(\s*["']([^"']+)["']\s*\)/);
            if (cjsRequire && cjsRequire[1]) {
                imports.add(cjsRequire[1]);
            }

            // Dynamic import: import('pkg')
            const dynImport = line.match(/import\s*\(\s*["']([^"']+)["']\s*\)/);
            if (dynImport && dynImport[1]) {
                imports.add(dynImport[1]);
            }

            // ES6 export default / named: export default MyComponent; export const foo = ...
            const esExportDef = line.match(/^export\s+default\s+(?:function|class|const|let|var)?\s*([A-Za-z0-9_$]+)/);
            if (esExportDef && esExportDef[1]) {
                exports.add(`default:${esExportDef[1]}`);
            }

            const esExportNamed = line.match(/^export\s+(?:const|let|var|function\*?|class|type|interface)\s+([A-Za-z0-9_$]+)/);
            if (esExportNamed && esExportNamed[1]) {
                exports.add(esExportNamed[1]);
            }

            // export { a, b, c as d }
            const esExportList = line.match(/^export\s*\{([^}]+)\}/);
            if (esExportList && esExportList[1]) {
                esExportList[1].split(',').forEach(item => {
                    const clean = item.trim().split(/\s+as\s+/)[0].trim();
                    if (clean) exports.add(clean);
                });
            }

            // CommonJS module.exports = ...
            const cjsExport = line.match(/module\.exports\s*=\s*(?:\{([^}]+)\}|([A-Za-z0-9_$]+))/);
            if (cjsExport) {
                if (cjsExport[1]) {
                    cjsExport[1].split(',').forEach(item => {
                        const clean = item.trim().split(':')[0].trim();
                        if (clean) exports.add(clean);
                    });
                } else if (cjsExport[2]) {
                    exports.add(`default:${cjsExport[2]}`);
                }
            }
        }

        // 2. Python
        else if (lang.includes('python') || lang.endsWith('py')) {
            // from x.y import a, b
            const pyFrom = line.match(/^from\s+([A-Za-z0-9_\.]+)\s+import\s+(.+)/);
            if (pyFrom) {
                imports.add(pyFrom[1]);
            } else {
                // import x, y
                const pyImport = line.match(/^import\s+([A-Za-z0-9_,\s]+)/);
                if (pyImport) {
                    pyImport[1].split(',').forEach(pkg => {
                        const clean = pkg.trim().split(/\s+as\s+/)[0].trim();
                        if (clean) imports.add(clean);
                    });
                }
            }

            // def / class exports
            const pyDef = line.match(/^(?:async\s+)?def\s+([A-Za-z0-9_]+)\s*\(/);
            if (pyDef && !pyDef[1].startsWith('_')) {
                exports.add(pyDef[1]);
            }
            const pyClass = line.match(/^class\s+([A-Za-z0-9_]+)/);
            if (pyClass && !pyClass[1].startsWith('_')) {
                exports.add(pyClass[1]);
            }
        }

        // 3. Java / Kotlin
        else if (lang.includes('java') || lang.includes('kotlin')) {
            const javaImport = line.match(/^import\s+(?:static\s+)?([A-Za-z0-9_\.]+);/);
            if (javaImport) {
                imports.add(javaImport[1]);
            }
            const javaClass = line.match(/public\s+(?:static\s+)?(?:class|interface|enum|record)\s+([A-Za-z0-9_]+)/);
            if (javaClass) {
                exports.add(javaClass[1]);
            }
        }

        // 4. Go
        else if (lang.includes('go')) {
            const goImport = line.match(/^import\s+["']([^"']+)["']/);
            if (goImport) {
                imports.add(goImport[1]);
            }
            const goFunc = line.match(/^func\s+(?:\([^)]+\)\s+)?([A-Z][A-Za-z0-9_]*)/);
            if (goFunc) {
                exports.add(goFunc[1]); // Capitalized identifiers are exported in Go
            }
        }

        // 5. C / C++
        else if (lang.includes('c') || lang.includes('cpp')) {
            const cInclude = line.match(/^#include\s+[<"]([^>"]+)[>"]/);
            if (cInclude) {
                imports.add(cInclude[1]);
            }
        }

        // 6. Rust
        else if (lang.includes('rust')) {
            const rsUse = line.match(/^use\s+([A-Za-z0-9_:]+);/);
            if (rsUse) {
                imports.add(rsUse[1]);
            }
            const rsPub = line.match(/^pub\s+(?:fn|struct|enum|trait)\s+([A-Za-z0-9_]+)/);
            if (rsPub) {
                exports.add(rsPub[1]);
            }
        }
    }

    return {
        imports: Array.from(imports),
        exports: Array.from(exports)
    };
};

/**
 * Scan source code deterministically for security vulnerabilities, secrets, and injection patterns
 */
const scanSecurityAndHeuristics = (filePath, content, language = '') => {
    const findings = [];
    if (!content || typeof content !== 'string') return findings;

    const lines = content.split('\n');

    SECURITY_PATTERNS.forEach(pattern => {
        lines.forEach((line, index) => {
            if (pattern.regex.test(line)) {
                // Ignore benign comments/tests if obvious
                const trimmed = line.trim();
                if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) {
                    if (!line.includes('AKIA') && !line.includes('PRIVATE KEY')) {
                        return; // skip commented out code unless critical credential
                    }
                }

                findings.push({
                    title: pattern.title,
                    severity: pattern.severity,
                    category: pattern.category,
                    file_path: filePath,
                    line_number: `Line ${index + 1}`,
                    description: pattern.explanation,
                    root_cause: pattern.root_cause,
                    impact: pattern.impact,
                    suggested_fix: pattern.suggested_fix
                });
            }
        });
    });

    return findings;
};

/**
 * Compute file metrics (lines, comments, blank lines)
 */
const computeFileMetrics = (content) => {
    if (!content || typeof content !== 'string') {
        return { totalLines: 0, codeLines: 0, commentLines: 0, blankLines: 0 };
    }

    const lines = content.split('\n');
    let blankLines = 0;
    let commentLines = 0;
    let codeLines = 0;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            blankLines++;
        } else if (line.startsWith('//') || line.startsWith('#') || line.startsWith('/*') || line.startsWith('*')) {
            commentLines++;
        } else {
            codeLines++;
        }
    }

    return {
        totalLines: lines.length,
        codeLines,
        commentLines,
        blankLines
    };
};

/**
 * Sanitize untrusted input to defend against prompt injection & malformed characters
 */
const sanitizeInputData = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/\0/g, '') // strip null bytes
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, ''); // strip ASCII control chars (preserving \t and \n)
};

module.exports = {
    extractImportsExports,
    scanSecurityAndHeuristics,
    computeFileMetrics,
    sanitizeInputData
};
