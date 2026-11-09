# report_sections_ch1_to_ch4.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def add_chapters_1_to_4(doc, helpers):
    add_para = helpers['add_para']
    add_heading1 = helpers['add_heading1']
    add_heading2 = helpers['add_heading2']
    add_chapter_heading = helpers['add_chapter_heading']
    format_para = helpers['format_para']
    add_run = helpers['add_run']
    style_table_borders = helpers['style_table_borders']

    # =========================================================================
    # CHAPTER 1: INTRODUCTION OF PROJECT
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 1\nINTRODUCTION OF PROJECT")

    add_heading1(doc, "1.1 BACKGROUND AND PROBLEM CONTEXT")
    add_para(doc, "In the modern era of continuous integration and agile software engineering, the speed of source code production has outpaced traditional manual quality assurance mechanisms. Distributed software development teams commit hundreds of pull requests daily across complex, multi-repository microservice architectures. As software codebases scale in cyclomatic complexity, architectural coupling, and dependency depth, ensuring consistent adherence to coding standards, software security baselines, and maintainability paradigms becomes an increasingly arduous bottleneck.")

    add_para(doc, "Traditional code review workflows rely primarily on human peer inspection. While human peer review is indispensable for evaluating high-level domain logic and algorithmic elegance, it suffers from several severe structural limitations. Human reviewers are vulnerable to cognitive fatigue, personal biases, subjective code-formatting preferences, and inconsistent vigilance during late-stage deployment sprints. Subtle memory leaks, resource leaks, concurrency vulnerabilities, unhandled exception paths, and architectural smells frequently slip into production builds despite manual gatekeeping.")

    add_para(doc, "Furthermore, as organizations onboard junior engineers and distributed offshore contractors, senior architects spend a disproportionate percentage of their engineering bandwidth performing repetitive syntactical corrections and baseline security audits. This operational friction inflates software engineering lead time, elevates defect escape rates, and substantially drives up technical debt across the enterprise lifecycle. There is consequently an urgent imperative for an automated, unified developer intelligence system that bridges deterministic metrics with nuanced semantic comprehension.")

    add_heading1(doc, "1.2 EVOLUTION OF SOFTWARE ENGINEERING AND DEVELOPER INTELLIGENCE")
    add_para(doc, "The evolution of developer assistance tools can be characterized across three distinct architectural epochs:")
    
    add_para(doc, "1. Deterministic Rule-Based Static Analyzers (1990s - 2010s): Early tooling, including ESLint, PMD, Checkstyle, and FindBugs, operated strictly via regular expressions, tokenization, and localized Abstract Syntax Tree (AST) pattern matching. While these tools execute with minimal latency and zero hallucinations, they exhibit zero semantic understanding, possess no awareness of cross-file structural intent, and generate enormous volumes of false positives that cause alert fatigue among developers.")

    add_para(doc, "2. Statistical Machine Learning and Heuristic Profilers (2010s - 2020): Systems such as SonarQube, CodeScene, and DeepCode introduced statistical defect prediction, technical debt estimation, and behavioral code churn analysis. These systems provided macroscopic visibility into repository health but remained largely non-generative; they could identify problematic modules but could not offer contextual explanations, refactoring diffs, or conversational design feedback.")

    add_para(doc, "3. Generative Artificial Intelligence and Large Language Models (2020 - Present): The advent of transformer-based Large Language Models (LLMs), such as OpenAI GPT-4, Anthropic Claude, and Google Gemini, revolutionized developer tooling by enabling natural-language code explanation, automated docstring synthesis, and intelligent review generation. However, naive deployments of LLMs face critical challenges: token window saturation, astronomical inference costs, nondeterministic scoring, API rate limiting, and severe security risks regarding proprietary intellectual property leakage.")

    add_heading1(doc, "1.3 OVERVIEW OF THE UNIFIED DEVELOPER INTELLIGENCE HUB (UDIH)")
    add_para(doc, "The Unified Developer Intelligence Hub (UDIH) is engineered as an enterprise-grade, multi-user, full-stack intelligence platform that harmonizes deterministic static code analysis with state-of-the-art generative artificial intelligence. Rather than treating static analysis and large language models as competing paradigms, UDIH synergizes both into an integrated, multi-tier pipeline.")

    add_para(doc, "Upon repository ingestion via secure ZIP archive upload, UDIH decompresses the archive into an ephemeral, isolated workspace. A specialized ingestion scanner performs multi-layer path traversal neutralization to defend against Zip Slip attacks. The system then invokes a dual-engine analysis workflow:")
    
    add_para(doc, "• Static Code Analyzer: Rapidly scans the entire polyglot codebase, parsing source files across JavaScript, TypeScript, Python, Java, C++, and Go. It extracts objective lines of code (LOC), file counts, structural complexity indicators, maintainability indices, and flags security red-flags (such as hardcoded secrets, weak cryptographic hashes, and command injections).")
    
    add_para(doc, "• AI Collaborative Review Engine: Employs an AST-aware structured context trimmer that prunes boilerplate syntax while retaining critical signatures, types, and logic boundaries. This condensed representation is fed into Google Gemini 2.5 Flash (with automatic failover to Gemini 1.5 Pro) using structured JSON schema constraints to generate deep architectural critiques, security vulnerability explanations, and actionable refactoring solutions.")

    add_para(doc, "The results are persisted in a multi-tier database layer utilizing MongoDB Atlas (with automatic local daemon fallback) and rendered across an interactive, responsive dashboard built with React 19 and Tailwind CSS. The platform features robust role-based access control (RBAC), multi-tenant project isolation, real-time user presence tracking via heartbeat daemons, and executive-level analytics.")

    add_heading1(doc, "1.4 OBJECTIVES OF THE PROJECT")
    add_para(doc, "The primary engineering and research objectives of the UDIH platform are formulated as follows:")
    
    add_para(doc, "1. Automated Project Ingestion and Sandboxing: To engineer an ephemeral, memory-safe file decompression and validation pipeline capable of accepting polyglot codebase archives while completely neutralizing path traversal and ZIP bomb vulnerabilities.")
    
    add_para(doc, "2. Hybrid Multi-Language Static Analysis: To build a deterministic static analysis engine that computes language distributions, cyclomatic complexity proxies, maintainability scores, and known vulnerability heuristics in under 2 seconds for mid-sized repositories.")
    
    add_para(doc, "3. Semantic AI Code Review with Dual-Model Resilience: To integrate the Google Gemini Generative AI SDK with an automated resilience mechanism that seamlessly transitions between Gemini 2.5 Flash and Gemini 1.5 Pro upon API exhaustion or rate-limiting events.")
    
    add_para(doc, "4. Structured Context Truncation and Data Leakage Prevention: To replace naive character-based text slicing with AST-guided structural truncation, ensuring prompt tokens remain strictly within budget while retaining maximum semantic information and preventing proprietary data leakage.")
    
    add_para(doc, "5. Enterprise Multi-Tenancy and Persistence Migration: To migrate the persistence architecture from localized file storage to cloud-hosted MongoDB Atlas with an automated local MongoDB daemon failover, complete with JWT-based role-based access control (Admin, Developer) and real-time presence telemetry.")

    add_heading1(doc, "1.5 SCOPE AND OPERATIONAL BOUNDARIES")
    add_para(doc, "The scope of the UDIH platform encompasses end-to-end repository ingestion, multi-paradigm analysis, AI-powered review synthesis, multi-user project management, and enterprise analytics. The operational boundaries include:")
    
    add_para(doc, "• In-Scope Capabilities: Support for multi-file ZIP archives up to 50 MB; polyglot language detection for 12 major programming languages; static metric calculation; AI architectural review with structured JSON output; user authentication, password hashing with bcrypt, session validation, and real-time heartbeat status monitoring; comprehensive admin audit logs.")
    
    add_para(doc, "• Out-of-Scope Capabilities (Current Release): Direct write-back integration to remote Git providers (e.g., auto-merging pull requests on GitHub/GitLab); dynamic runtime execution or sandboxed code compilation; processing compiled binary executables or proprietary encrypted containers.")

    add_heading1(doc, "1.6 REPORT ORGANIZATION")
    add_para(doc, "This Capstone Project report is systematically structured into eleven comprehensive chapters:")
    add_para(doc, "• Chapter 1 introduces the project context, software quality challenges, system overview, and core engineering objectives.")
    add_para(doc, "• Chapter 2 surveys existing academic and industrial literature across static code analyzers, deep learning models, LLMs, and multi-tenant security paradigms.")
    add_para(doc, "• Chapter 3 formulates the formal problem statement, context leakage challenges, and quantifiable success metrics.")
    add_para(doc, "• Chapter 4 details stakeholder profiles, functional requirements (FR-01 to FR-15), non-functional constraints (NFR-01 to NFR-08), feasibility analysis, and risk mitigations.")
    add_para(doc, "• Chapter 5 establishes the high-level system architecture, service decoupling, dual-model resilience, and dual-mode persistence.")
    add_para(doc, "• Chapter 6 presents formal UML and data flow models, including Use Case, Sequence, Activity, DFD Level 1, ERD, and State diagrams.")
    add_para(doc, "• Chapter 7 provides exhaustive implementation details for the Ingestion Engine, Static Code Analyzer, AI Review Pipeline, Authentication, and Analytics.")
    add_para(doc, "• Chapter 8 outlines the verification strategy, formal test cases suite (TC-01 to TC-15), security penetration testing, and benchmarking evidence.")
    add_para(doc, "• Chapter 9 presents experimental results, performance comparisons, token efficiency metrics, and academic discussions.")
    add_para(doc, "• Chapter 10 highlights learning outcomes, engineering reflections, individual team contributions, and PO/PSO mapping.")
    add_para(doc, "• Chapter 11 concludes the thesis with limitations and a strategic future roadmap.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 2: LITERATURE SURVEY AND RELATED WORK
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 2\nLITERATURE SURVEY AND RELATED WORK")

    add_heading1(doc, "2.1 CLASSICAL STATIC CODE ANALYSIS FRAMEWORKS")
    add_para(doc, "Static program analysis has served as the bedrock of software verification for over three decades. Classical frameworks operate on source code without dynamic program execution, relying on lexical analysis, Abstract Syntax Tree (AST) construction, Control Flow Graphs (CFG), and Data Flow Analysis (DFA). Prominent tools such as SonarQube, ESLint, FindBugs, and Bandit implement deterministic rule sets to identify syntax violations, antipatterns, and known Common Weakness Enumerations (CWEs).")

    add_para(doc, "ESLint revolutionized JavaScript static analysis by introducing pluggable AST rules executed via the Espree parser. In Python ecosystems, Bandit parses AST nodes to identify dangerous function invocations such as exec(), eval(), and unvalidated subprocess calls. In Java enterprise systems, PMD and SpotBugs analyze compiled bytecode to detect null pointer dereferences, unclosed database handles, and thread-safety violations.")

    add_para(doc, "However, academic research by Johnson et al. (2013) and Christakis et al. (2016) demonstrated that developers reject up to 80% of warnings generated by traditional static analysis tools due to high false-positive rates and the lack of contextual explanation. Classical analyzers evaluate syntax in isolation; they cannot deduce whether a seemingly redundant variable assignment is intentionally designed for thread-local caching or algorithmic clarity.")

    add_heading1(doc, "2.2 DEEP LEARNING AND TRANSFORMERS IN SOFTWARE ENGINEERING")
    add_para(doc, "To overcome the rigid limitations of static pattern matching, researchers applied natural language processing (NLP) techniques to source code representations. The fundamental premise, termed the 'naturalness hypothesis' by Hindle et al. (2012), posits that programming languages exhibit statistical regularities analogous to human natural languages.")

    add_para(doc, "Initial machine learning approaches employed Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) networks for token completion and bug localization. However, these models struggled to capture long-range semantic dependencies spanning hundreds of lines. The paradigm shifted dramatically with the introduction of Transformer architectures based on self-attention mechanisms (Vaswani et al., 2017).")

    add_para(doc, "Feng et al. (2020) introduced CodeBERT, a bimodal pre-trained model for programming and natural languages trained on the CodeSearchNet corpus. CodeBERT achieved state-of-the-art results on code search and documentation generation by mapping code tokens and natural language queries into a unified embedding space. Subsequent domain-specific foundation models, including GraphCodeBERT (Guo et al., 2021) and CodeLlama (Roziere et al., 2023), incorporated data flow edges and extended context lengths to enhance structural comprehension.")

    add_heading1(doc, "2.3 LARGE LANGUAGE MODELS FOR AUTOMATED CODE REVIEW")
    add_para(doc, "The convergence of massive foundational models with multi-turn instruction tuning catalyzed the deployment of generative AI in automated code review. Systems built on GPT-4 (Achiam et al., 2023) and Google Gemini (Gemini Team, 2024) demonstrate unprecedented fluency in explaining complex algorithmic workflows, detecting logic inversions, and proposing refactored code snippets.")

    add_para(doc, "Gemini represents a multimodal, highly scalable transformer architecture trained across diverse code repositories, academic texts, and mathematical corpora. Gemini 2.5 Flash provides sub-second inference latency and high token processing throughput, rendering it uniquely suited for real-time developer workflows. However, deploying LLMs directly on entire software repositories introduces severe engineering bottlenecks:")
    
    add_para(doc, "• Context Window Saturation: Large codebases easily exceed 500,000 tokens, overwhelming LLM context windows and incurring steep inference costs.")
    add_para(doc, "• The 'Lost in the Middle' Phenomenon: Research by Liu et al. (2023) indicates that transformer attention degrades when critical defect information is buried in the middle of long prompts.")
    add_para(doc, "• Nondeterminism: LLMs cannot reliably guarantee mathematical consistency or repeat identical metric calculations across consecutive invocations.")

    add_heading1(doc, "2.4 MULTI-TENANT DEVELOPER PLATFORMS AND SECURITY PARADIGMS")
    add_para(doc, "Enterprise adoption of cloud-based developer intelligence mandates rigorous security controls and multi-tenant data isolation. Centralized code repositories contain proprietary business logic, sensitive algorithmic trade secrets, and internal infrastructure configurations. Exposing source code to untrusted cloud environments risks catastrophic intellectual property compromise.")

    add_para(doc, "Modern cloud platforms employ stateless JSON Web Tokens (JWT) for authentication, coupled with Role-Based Access Control (RBAC) to enforce least-privilege principles (Sandhu et al., 1996). Furthermore, uploading and processing foreign ZIP archives introduces severe file-system vulnerabilities, notably the Zip Slip attack (Snyk, 2018), where malicious directory traversal characters ('../') allow files to be written outside the target sandboxed directory.")

    add_heading1(doc, "2.5 CRITICAL COMPARATIVE ANALYSIS OF EXISTING SOLUTIONS")
    add_para(doc, "Table 2.1 provides a rigorous comparative evaluation between UDIH and leading enterprise solutions across static precision, AI semantic depth, multi-tenancy, and operational resilience.")

    # Table 2.1
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 2.1: Comparative Evaluation of Industry Code Quality & AI Platforms", bold=True, size=10.5)

    comp_table = doc.add_table(rows=6, cols=6)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in comp_table.rows:
        r.cells[0].width = Inches(1.3)
        r.cells[1].width = Inches(1.0)
        r.cells[2].width = Inches(1.0)
        r.cells[3].width = Inches(1.0)
        r.cells[4].width = Inches(1.0)
        r.cells[5].width = Inches(1.2)

    headers = ["Feature / Dimension", "SonarQube", "DeepCode", "CodeScene", "GitHub Copilot", "UDIH (Proposed)"]
    for j, h in enumerate(headers):
        c = comp_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    matrix = [
        ("Deterministic Static Metrics", "Full (AST/Rules)", "Partial", "Heuristic Churn", "None", "Full Multi-Language"),
        ("Generative AI Review", "None", "None", "None", "Interactive Prompt", "Dual-Model (Gemini)"),
        ("Structured Context Trimming", "N/A", "N/A", "N/A", "Sliding Window", "AST-Aware Structural"),
        ("Multi-Model Resilience / Failover", "No", "No", "No", "Single Provider", "Flash -> Pro Automatic"),
        ("Multi-Tier Persistence Failover", "PostgreSQL / DB", "Cloud Only", "Local/Cloud", "Cloud Only", "Atlas -> Local Daemon")
    ]
    for i, row in enumerate(matrix):
        r = comp_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, bold=True, size=8.5)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, size=8.5)

    style_table_borders(comp_table)

    add_heading1(doc, "2.6 IDENTIFICATION OF RESEARCH AND ENGINEERING Gaps")
    add_para(doc, "The comparative survey reveals several conspicuous technical gaps in contemporary software engineering platforms:")
    add_para(doc, "1. Binary Tooling Dichotomy: Existing tools force organizations to choose between rigid, unhelpful static linters and expensive, ungrounded LLM review interfaces. A unified pipeline combining deterministic AST metrics with semantic review does not exist in open developer tooling.")
    add_para(doc, "2. Crude Prompt Truncation: Commercial LLM tools apply simplistic character-level string slicing (e.g., cutting off files at exactly 15,000 characters), which severs syntactic scopes, truncates closing brackets, and destroys semantic context.")
    add_para(doc, "3. Fragile Single-Model AI Dependencies: Production developer tools depend on a single AI endpoint, causing system failure whenever rate limits, quotas, or cloud outages occur.")
    add_para(doc, "4. Inflexible Persistence Architecture: Modern developer tools lack graceful local-cloud persistence failover, halting developer operations when cloud database connections experience intermittent network latency.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 3: PROBLEM STATEMENT AND ENGINEERING OBJECTIVES
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 3\nPROBLEM STATEMENT AND ENGINEERING OBJECTIVES")

    add_heading1(doc, "3.1 PROBLEM DEFINITION IN MODERN ENTERPRISE CODEBASES")
    add_para(doc, "As contemporary enterprise software engineering transitions toward microservices, polyglot architectures, and high-frequency deployment cadences, the challenges surrounding software quality governance have escalated. Codebases frequently incorporate multiple programming languages across varying framework versions, complicating standardized compliance monitoring.")

    add_para(doc, "Engineering leaders are confronted with three fundamental bottlenecks: (1) The Technical Debt Accumulation Trap, where legacy code smells and architectural anti-patterns compound silently due to rapid feature delivery; (2) The Cognitive Review Overhead, wherein senior software architects devote up to 25% of their working hours performing mechanical, repetitive code inspections; and (3) The Disconnected Tooling Fragment, wherein development teams must toggle between fragmented dashboards, standalone linters, and external AI chat interfaces to assemble a complete quality profile.")

    add_heading1(doc, "3.2 CONTEXT WINDOW SATURATION AND INFORMATION LEAKAGE CHALLENGES")
    add_para(doc, "When organizations attempt to integrate generative AI into their quality assurance workflows, two acute architectural failures routinely manifest:")

    add_para(doc, "First, the naive submission of entire source code files into LLM context windows causes severe token bloat and financial inefficiency. In naive implementations, source files are either truncated at arbitrary character thresholds (e.g., slicing at character 15,000) or rejected entirely. Slicing at a character boundary frequently splits variable names in half, terminates functions abruptly, and leaves control loops unclosed. Consequently, the language model hallucinates syntax errors that do not exist in the source code while overlooking critical architectural vulnerabilities located beyond the cut-off boundary.")

    add_para(doc, "Second, submitting unfiltered codebases to third-party generative models poses acute data leakage hazards. Naive prompts may inadvertently leak API tokens, cryptographic credentials, database connection strings, and personally identifiable client data embedded in the source code. An engineered solution must filter sensitive markers, preserve essential structural context, and enforce strict token conservation before invoking cloud AI APIs.")

    add_heading1(doc, "3.3 NEED FOR A HYBRID STATIC-HEURISTIC AND GENERATIVE PARADIGM")
    add_para(doc, "To establish true developer intelligence, software engineering systems cannot rely exclusively on either static heuristics or generative transformers. A mathematically grounded static analyzer provides deterministic invariants: exact line counts, Cyclomatic Complexity calculations, nesting depth measurements, and known vulnerability pattern matches. These metrics are mathematically verifiable, fast, and 100% reproducible.")

    add_para(doc, "Conversely, generative foundation models excel at contextual synthesis: comprehending developer intent, identifying anti-patterns that span multiple conceptual components, evaluating naming clarity, and generating tailored refactoring suggestions. UDIH synthesizes these complementary paradigms into a single, cohesive intelligence pipeline.")

    add_heading1(doc, "3.4 CORE ENGINEERING GOALS AND SUCCESS CRITERIA")
    add_para(doc, "The UDIH platform is engineered around five rigorous, quantifiable technical goals:")
    add_para(doc, "• Goal 1: Zero-Vulnerability Ephemeral Ingestion. Achieve 100% prevention of path traversal attacks (Zip Slip) and file-system corruption during ZIP decompression while ensuring immediate cleanup of temporary build directories.")
    add_para(doc, "• Goal 2: Sub-Second Static Analysis. Complete static parsing, metric computation, and maintainability scoring for repositories with up to 10,000 lines of code in under 1,500 milliseconds.")
    add_para(doc, "• Goal 3: Zero-Failure AI Resilience. Maintain 99.9% uptime for AI review synthesis by engineering an automated fallback circuit between Google Gemini 2.5 Flash and Gemini 1.5 Pro.")
    add_para(doc, "• Goal 4: Context Preservation with Zero Syntax Severing. Ensure that all truncated prompts sent to the Gemini API retain complete syntactic tokens, function signatures, and structural boundaries without unclosed brackets or severed identifiers.")
    add_para(doc, "• Goal 5: Seamless Dual-Mode Persistence. Ensure 100% persistence uptime by automatically failing over from MongoDB Atlas to a localized MongoDB daemon when cloud network connectivity is severed.")

    add_heading1(doc, "3.5 EXPECTED ENGINEERING AND SOCIETAL OUTCOMES")
    add_para(doc, "The successful deployment of UDIH yields substantial engineering benefits: a projected 40% reduction in manual code review turnaround times, a 60% reduction in defect escape rates, and total elimination of developer alert fatigue. From a societal and institutional perspective, UDIH democratizes advanced developer intelligence, providing educational institutions and emerging startups with enterprise-tier software audit capabilities without the prohibitive licensing costs of proprietary legacy suites.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 4: REQUIREMENT ANALYSIS, FEASIBILITY, AND RISK ASSESSMENT
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 4\nREQUIREMENT ANALYSIS, FEASIBILITY, AND RISK ASSESSMENT")

    add_heading1(doc, "4.1 STAKEHOLDER PROFILES AND PERSONA ANALYSIS")
    add_para(doc, "To ensure practical enterprise viability, UDIH is engineered around three primary stakeholder personas:")
    add_para(doc, "1. Junior Software Developer (Persona: Alex): Requires instant, educational feedback on submitted code. Needs clear explanations of code smells, memory safety guidelines, and concrete refactoring suggestions without harsh or unhelpful criticism.")
    add_para(doc, "2. Senior Lead Architect (Persona: Priya): Requires macro-level visibility into repository maintainability, technical debt trajectories, language distributions, and automated verification of security standards across distributed teams.")
    add_para(doc, "3. Enterprise Platform Administrator (Persona: Marcus): Responsible for user lifecycle management, role-based access enforcement, security auditing, and monitoring platform resource utilization and API consumption.")

    add_heading1(doc, "4.2 FUNCTIONAL REQUIREMENTS SPECIFICATION")
    add_para(doc, "The functional requirements of the UDIH platform are systematically itemized and categorized in Table 4.1.")

    # Table 4.1
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 4.1: Comprehensive Functional Requirements Specification (FR-01 to FR-15)", bold=True, size=10.5)

    fr_table = doc.add_table(rows=16, cols=4)
    fr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in fr_table.rows:
        r.cells[0].width = Inches(1.0)
        r.cells[1].width = Inches(1.6)
        r.cells[2].width = Inches(3.0)
        r.cells[3].width = Inches(0.9)

    headers = ["Req. ID", "Functional Module", "Detailed Requirement Specification", "Priority"]
    for j, h in enumerate(headers):
        c = fr_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    fr_list = [
        ("FR-01", "User Authentication", "Secure user registration with bcrypt salt rounds (10) and email normalization.", "High"),
        ("FR-02", "Session Management", "JWT-based stateless authentication with 7-day expiration and token invalidation.", "High"),
        ("FR-03", "Role-Based Access", "Enforce strict RBAC separating Admin and Developer permissions across all API routes.", "High"),
        ("FR-04", "Heartbeat Telemetry", "Periodic WebSocket/HTTP heartbeat tracking live user presence (online/offline).", "Medium"),
        ("FR-05", "Archive Ingestion", "Upload ZIP archives up to 50 MB with path sanitization and Zip Slip prevention.", "High"),
        ("FR-06", "Ephemeral Decompression", "Decompress repository to isolated directory with automated error cleanup.", "High"),
        ("FR-07", "Polyglot Language Scan", "Detect language distribution and total LOC across 12+ programming languages.", "High"),
        ("FR-08", "Static Metrics Engine", "Compute maintainability index, cyclomatic proxies, and file complexity metrics.", "High"),
        ("FR-09", "Security Heuristics", "Flag hardcoded secrets, weak cryptographic hashes, and command injections.", "High"),
        ("FR-10", "Structured Truncation", "AST-aware prompt trimming preserving syntax boundaries within token limits.", "High"),
        ("FR-11", "AI Review Engine", "Generate multi-category architectural review via Gemini 2.5 Flash SDK.", "High"),
        ("FR-12", "Dual-Model Failover", "Automatically reroute AI requests to Gemini 1.5 Pro upon quota or rate limit.", "High"),
        ("FR-13", "Dual-Mode Persistence", "Persist projects and reviews in MongoDB Atlas with automated local fallback.", "High"),
        ("FR-14", "Dashboard Analytics", "Display 30-day activity trends, volume charts, and isolated user metrics.", "Medium"),
        ("FR-15", "Admin User Management", "Provide user activation, deletion, and system-wide activity audit logs.", "Medium")
    ]
    for i, row in enumerate(fr_list):
        r = fr_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j == 0 or j == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, bold=(j==0), size=8)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, size=8)

    style_table_borders(fr_table)

    add_heading1(doc, "4.3 NON-FUNCTIONAL REQUIREMENTS SPECIFICATION")
    add_para(doc, "The non-functional requirements define the operational qualities, architectural constraints, and service level objectives (SLOs) of the platform, as detailed in Table 4.2.")

    # Table 4.2
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 4.2: Non-Functional Requirements Specification (NFR-01 to NFR-08)", bold=True, size=10.5)

    nfr_table = doc.add_table(rows=9, cols=4)
    nfr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in nfr_table.rows:
        r.cells[0].width = Inches(1.0)
        r.cells[1].width = Inches(1.5)
        r.cells[2].width = Inches(3.2)
        r.cells[3].width = Inches(0.8)

    headers = ["NFR ID", "Quality Dimension", "Target Quantitative Metric / Architectural Constraint", "Category"]
    for j, h in enumerate(headers):
        c = nfr_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    nfr_list = [
        ("NFR-01", "Response Latency", "Static analysis latency < 1.5 seconds; API health checks < 50 ms.", "Performance"),
        ("NFR-02", "AI Processing Latency", "AI review generation < 8.0 seconds for average repository prompts.", "Performance"),
        ("NFR-03", "Data Isolation", "100% tenant data separation; users cannot query foreign projects.", "Security"),
        ("NFR-04", "Cryptographic Rigor", "Bcrypt hashing with >= 10 salt rounds; JWT signed via HMAC-SHA256.", "Security"),
        ("NFR-05", "Database Availability", "99.95% persistence availability via automated Atlas to Local failover.", "Reliability"),
        ("NFR-06", "Memory Footprint", "Backend process memory < 512 MB during concurrent 50 MB archive uploads.", "Scalability"),
        ("NFR-07", "UI Responsiveness", "Client-side First Contentful Paint (FCP) < 1.2s; Mobile-first responsive.", "Usability"),
        ("NFR-08", "Code Maintainability", "Modular decoupled MVC architecture with TypeScript/ES6 documentation.", "Maintainability")
    ]
    for i, row in enumerate(nfr_list):
        r = nfr_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j == 0 or j == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, bold=(j==0), size=8)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, size=8)

    style_table_borders(nfr_table)

    add_heading1(doc, "4.4 COMPREHENSIVE FEASIBILITY ANALYSIS")
    add_para(doc, "A rigorous four-dimensional feasibility study was executed prior to system construction:")
    add_para(doc, "• Technical Feasibility: The integration of React 19, Tailwind CSS, Express 5, and the Google Gemini Generative AI SDK was validated through rapid prototyping. Modern Node.js asynchronous event loops easily manage concurrent I/O operations and file decompressions.")
    add_para(doc, "• Operational Feasibility: The platform requires zero client-side installation, functioning seamlessly across any standard modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). Developer workflows are simplified through drag-and-drop ZIP uploads.")
    add_para(doc, "• Economic Feasibility: Utilizing open-source core libraries (Express, React, Mongoose) coupled with generous free-tier cloud quotas for MongoDB Atlas and Google Gemini API ensures minimal operating expenses, making the architecture economically viable for universities and startups.")
    add_para(doc, "• Schedule Feasibility: The project was structured across a 16-week timeline partitioned into four distinct phases (Analysis, Core Ingestion, AI Integration, Hardening & Migration), with all milestones achieved within planned deadlines.")

    add_heading1(doc, "4.5 RISK ASSESSMENT, HAZARD ANALYSIS, AND MITIGATION STRATEGIES")
    add_para(doc, "Table 4.3 outlines the identified engineering risks, severity ratings, and implemented mitigations.")

    # Table 4.3
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 4.3: Risk Identification, Severity Matrix, and Engineered Mitigations", bold=True, size=10.5)

    risk_table = doc.add_table(rows=6, cols=5)
    risk_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in risk_table.rows:
        r.cells[0].width = Inches(0.9)
        r.cells[1].width = Inches(1.8)
        r.cells[2].width = Inches(0.8)
        r.cells[3].width = Inches(0.8)
        r.cells[4].width = Inches(2.2)

    headers = ["Risk ID", "Identified Technical Hazard", "Likelihood", "Impact", "Architectural Mitigation"]
    for j, h in enumerate(headers):
        c = risk_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    risk_list = [
        ("RSK-01", "Zip Slip File Traversal Attack", "High", "Critical", "Path resolution checks rejecting any path containing '../'."),
        ("RSK-02", "Gemini API Quota / Rate Limiting", "High", "High", "Automated fallback to Gemini 1.5 Pro + exponential backoff."),
        ("RSK-03", "Atlas Cloud Network Disruption", "Medium", "High", "Automated local MongoDB daemon connect-retry circuit."),
        ("RSK-04", "Prompt Injection in Source Code", "Medium", "Medium", "Strict JSON schema enforcement with negative prompt guards."),
        ("RSK-05", "Server Memory Exhaustion on Upload", "Low", "High", "50 MB file size limit with synchronous stream buffer cleanup.")
    ]
    for i, row in enumerate(risk_list):
        r = risk_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j in [0, 2, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, bold=(j==0), size=8)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, size=8)

    style_table_borders(risk_table)

    add_heading1(doc, "4.6 DEVELOPMENT METHODOLOGY AND ITERATIVE SPRINT EXECUTION")
    add_para(doc, "The UDIH engineering lifecycle followed an Agile-Scrum methodology across five iterative two-week sprints. Sprint 1 focused on basic repository ingestion and SQLite storage. Sprint 2 implemented the multi-language static code analyzer. Sprint 3 integrated Google Gemini 2.5 Flash and prompt truncation. Sprint 4 executed the enterprise multi-user upgrade, migrating the database to MongoDB Atlas with JWT RBAC. Sprint 5 completed performance hardening, security auditing, and documentation compilation.")

    print("Chapters 1 to 4 added successfully.")
