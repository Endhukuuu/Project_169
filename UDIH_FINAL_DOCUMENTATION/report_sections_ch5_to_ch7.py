# report_sections_ch5_to_ch7.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
import os

def add_chapters_5_to_7(doc, doc_dir, helpers):
    add_para = helpers['add_para']
    add_heading1 = helpers['add_heading1']
    add_heading2 = helpers['add_heading2']
    add_chapter_heading = helpers['add_chapter_heading']
    format_para = helpers['format_para']
    add_run = helpers['add_run']
    style_table_borders = helpers['style_table_borders']
    add_figure = helpers['add_figure']

    # =========================================================================
    # CHAPTER 5: SYSTEM ARCHITECTURE AND PROPOSED METHODOLOGY
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 5\nSYSTEM ARCHITECTURE AND PROPOSED METHODOLOGY")

    add_heading1(doc, "5.1 HIGH-LEVEL ARCHITECTURAL PARADIGM")
    add_para(doc, "The Unified Developer Intelligence Hub (UDIH) is architected around a decoupled, multi-tier client-server paradigm designed for enterprise scalability, fault tolerance, and multi-tenant security. Rather than coupling presentation and computation into a monolithic web framework, UDIH establishes clear abstraction boundaries between the single-page client interface, the RESTful application programming interface (API), the asynchronous ingestion pipeline, and the persistence tier.")

    add_para(doc, "This decoupled methodology affords distinct engineering advantages: (1) independent horizontal scalability of the compute-intensive analysis services without burdening the presentation layer; (2) isolated fault domains ensuring that an unexpected failure during external AI API invocation does not disrupt project persistence or static dashboard metrics; and (3) cross-platform client support, enabling seamless future integrations with CLI utilities and IDE extensions via standard HTTP/REST contracts.")

    add_heading1(doc, "5.2 TIERED LAYER DECOMPOSITION AND SERVICE BOUNDARIES")
    add_para(doc, "The platform decomposes into four distinct architectural layers, as visualized in Figure 5.1:")

    # Figure 5.1
    fig_arch_path = os.path.join(doc_dir, "fig_system_architecture.png")
    add_figure(doc, fig_arch_path, "Figure 5.1: High-Level Tiered System Architecture of UDIH", width=5.0)

    add_para(doc, "1. Presentation Layer (Client Tier): Developed using React 19, Tailwind CSS, and Lucide React icons. This layer implements a modern, single-page application (SPA) architecture comprising the Executive Dashboard, Repository Upload Sandbox, Deep Code Inspector, AI Collaborative Review Viewer, and the Administration Management Console.")

    add_para(doc, "2. Application & API Routing Tier: Built on Node.js and Express 5. This layer handles incoming HTTP requests, enforces CORS policies, parses multipart/form-data payloads via Multer, executes JWT authentication, and dispatches tasks to underlying controller modules.")

    add_para(doc, "3. Intelligence & Processing Core: Comprises three specialized computational engines: (a) Ephemeral Archive Ingestion Engine; (b) Deterministic Polyglot Static Code Analyzer; and (c) AI Semantic Review Engine powered by the Google Gemini Generative AI SDK.")

    add_para(doc, "4. Persistence & Telemetry Layer: Implements a resilient dual-mode persistence architecture with MongoDB Atlas as the primary cloud database, backed by an automated local MongoDB daemon failover circuit and real-time heartbeat presence tracking.")

    add_heading1(doc, "5.3 DECOUPLED SERVICE ARCHITECTURE: ANALYSIS VS. COLLABORATIVE REVIEW")
    add_para(doc, "A foundational architectural innovation in UDIH is the absolute decoupling of the Static Code Analyzer from the AI Collaborative Code Review service. In legacy systems, static linting and LLM prompt generation are executed synchronously in a single monolithic handler. If the external AI service suffers from high network latency or API rate limits, the entire request times out, leaving the user with zero feedback.")

    add_para(doc, "In UDIH, when a developer submits an archive, the Static Code Analyzer executes immediately in the local Node.js runtime, generating structural metrics (LOC, language breakdown, file complexity, maintainability indices) in under 1,500 milliseconds. These metrics are persisted immediately to the Project document. Simultaneously, the AI Collaborative Review Engine is triggered as an asynchronous pipeline stage, utilizing the static metrics as contextual ground-truth. Even if the AI review fails due to external API exhaustion, the user retains complete access to all static analysis data.")

    add_heading1(doc, "5.4 DUAL-MODEL AI RESILIENCE FRAMEWORK")
    add_para(doc, "To achieve high availability when interfacing with commercial LLMs, UDIH implements a Dual-Model Resilience Architecture. The primary model utilized is Google Gemini 2.5 Flash, selected for its rapid inference latency (sub-5 seconds), high token capacity, and cost-effective operation. However, in the event of HTTP 429 (Resource Exhausted / Rate Limit Exceeded) or HTTP 503 (Service Unavailable) status codes, UDIH's AI service automatically invokes an automated fallback circuit to Gemini 1.5 Pro.")

    # Figure 5.2 (Pipeline Stages & Fallback Flow)
    fig_pipe_path = os.path.join(doc_dir, "fig_pipeline_stages.png")
    add_figure(doc, fig_pipe_path, "Figure 5.2: Five-Stage Analysis Pipeline & Dual-Model Resilience Flowchart", width=5.0)

    add_para(doc, "As diagrammed in Figure 5.2, the request is intercepted by an exponential backoff wrapper. If the primary Gemini 2.5 Flash invocation fails after two retry attempts with jitter, the payload is dynamically reformatted and dispatched to the Gemini 1.5 Pro endpoint. This multi-model failover circuit eliminates single-point-of-failure vulnerabilities in AI-driven pipelines.")

    add_heading1(doc, "5.5 DUAL-MODE PERSISTENCE ARCHITECTURE: MONGODB ATLAS & LOCAL FAILOVER")
    add_para(doc, "To provide maximum deployment flexibility and continuous availability during network disruptions, UDIH implements a dual-mode database persistence mechanism. In production mode, the backend connects securely to a cloud-hosted MongoDB Atlas cluster using encrypted TLS connections.")

    add_para(doc, "In environments where cloud connectivity is interrupted, DNS resolution fails, or external egress traffic is blocked by firewall policies, the Mongoose connection manager intercepts the socket timeout error and automatically re-routes the connection URI to a localized MongoDB daemon running on localhost:27017. All Mongoose schemas, document validations, indexes, and aggregation pipelines operate identically across both cloud and local targets, ensuring zero functional degradation.")

    add_heading1(doc, "5.6 STRUCTURED PROMPT TRUNCATION & AST CONTEXT PRESERVATION")
    add_para(doc, "A primary technical optimization implemented in UDIH addresses the severe limitation of naive character-based text slicing. Previously, code review prompts were cut off arbitrarily at 15,000 characters. Slicing at an exact character index regularly bisects variable declarations, terminates function blocks prematurely, and leaves brackets unclosed, inducing hallucinations in downstream LLMs.")

    add_para(doc, "UDIH introduces an AST-aware structured context trimmer. The algorithm operates through three systematic stages:")
    add_para(doc, "1. File Prioritization and Entropy Ranking: Files are ranked by architectural importance (entry points, configuration, core service logic vs. generated bundles or test fixtures).")
    add_para(doc, "2. Syntactic Token Preservation: When budget limits are approached, the trimmer strips comments and redundant whitespace, but preserves full function signatures, exported interface types, and structural blocks.")
    add_para(doc, "3. Graceful Ellipsis Insertion: Non-essential function bodies are replaced with structured syntactic markers ('/* ... implementation omitted for brevity ... */'), guaranteeing that opening and closing brackets remain strictly balanced. This eliminates syntax fragmentation and ensures prompt tokens remain strictly within budget.")

    add_heading1(doc, "5.7 SECURITY ARCHITECTURE: JWT AUTH, RBAC, AND EPHEMERAL SANDBOXING")
    add_para(doc, "Security is engineered into every tier of the platform. The authentication mechanism utilizes bcrypt password hashing with 10 salt rounds and issues HMAC-SHA256 signed JSON Web Tokens (JWT) containing encrypted user identifiers and role claims. Role-Based Access Control (RBAC) middleware intercepts every protected API endpoint:")
    add_para(doc, "• Developer Role: Granted permissions to ingest repositories, trigger static and AI analysis, inspect project-specific dashboards, and delete owned projects.")
    add_para(doc, "• Administrator Role: Granted elevated permissions to view all system users, inspect platform-wide audit logs, monitor online presence, and perform administrative user lifecycle operations.")
    add_para(doc, "• Ephemeral Directory Sandboxing: Uploaded ZIP files are decompressed into unique, randomized subdirectories within the OS temporary directory. Path strings are resolved against the sandbox root; any path attempting to traverse outside ('../') is immediately rejected, neutralizing Zip Slip exploits. Once analysis concludes, the ephemeral directory is synchronously removed.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 6: SYSTEM DESIGN, UML MODELING, AND DATA WORKFLOWS
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 6\nSYSTEM DESIGN, UML MODELING, AND DATA WORKFLOWS")

    add_heading1(doc, "6.1 USE CASE MODELING AND ACTOR INTERACTION ANALYSIS")
    add_para(doc, "The functional capabilities of the UDIH platform and their interactions with human actors are formalized using Unified Modeling Language (UML) use case specifications. The platform defines two primary human actors: Developer and Administrator, interacting with two external automated systems: Google Gemini AI API and MongoDB Atlas.")

    # Figure 6.1
    fig_uc_path = os.path.join(doc_dir, "fig_use_case_diagram.png")
    add_figure(doc, fig_uc_path, "Figure 6.1: Unified Use Case Diagram for Developer and Administrator Roles", width=5.4)

    add_para(doc, "As illustrated in Figure 6.1, the Developer actor interacts with use cases such as Register / Login, Upload Repository ZIP, Trigger Static Analysis, View Quality Scores, Request AI Code Review, and Inspect Historical Analytics. The Administrator actor extends these capabilities with Manage User Accounts, View Global Telemetry, and Inspect Audit Logs. Both the AI Review and Persistence operations require interactions with external cloud interfaces.")

    add_heading1(doc, "6.2 DYNAMIC BEHAVIORAL MODELING: SEQUENCE DIAGRAMS")
    add_para(doc, "The chronological sequence of messages and execution steps involved during a complete repository analysis lifecycle is modeled in Figure 6.2.")

    # Figure 6.2
    fig_seq_path = os.path.join(doc_dir, "fig_sequence_diagram.png")
    add_figure(doc, fig_seq_path, "Figure 6.2: System Sequence Diagram for Ingestion, Analysis, and AI Review", width=5.4)

    add_para(doc, "The sequence begins when the Developer submits a ZIP file via the React Client. The Express API validates the JWT bearer token, invokes the Ingestion Sandbox to extract and sanitize files, and immediately triggers the Static Code Analyzer. Upon completion, static metrics are saved to MongoDB, and a response is dispatched back to the UI. The client then issues an asynchronous request to the AI Review Endpoint, which triggers the Structured Context Trimmer, queries Gemini 2.5 Flash (with fallback to 1.5 Pro), parses the structured JSON payload, and persists the review document.")

    add_heading1(doc, "6.3 WORKFLOW MODELING: ACTIVITY DIAGRAMS")
    add_para(doc, "The multi-branch decision logic and concurrency aspects of the ingestion and review workflows are represented in the UML Activity Diagram in Figure 6.3.")

    # Figure 6.3
    fig_act_path = os.path.join(doc_dir, "fig_activity_diagram.png")
    add_figure(doc, fig_act_path, "Figure 6.3: Activity Diagram for Multi-Stage Pipeline Execution Lifecycle", width=5.4)

    add_para(doc, "The activity flow illustrates critical decision branches: verifying ZIP file validity, checking path traversal markers, evaluating whether the primary Gemini model responds within timeout thresholds, and executing automated fallback upon rate-limit triggers. The flow terminates with persistent state commits and ephemeral sandbox cleanup.")

    add_heading1(doc, "6.4 DATA FLOW MODELING")
    add_para(doc, "Data Flow Diagrams (DFDs) capture the operational transformation of data packets as they transit through the system. Figure 6.4 depicts the Level 1 DFD for the core code analysis and review engine.")

    # Figure 6.4
    fig_dfd_path = os.path.join(doc_dir, "fig_dfd_level1.png")
    add_figure(doc, fig_dfd_path, "Figure 6.4: Level 1 Data Flow Diagram (DFD) for Code Analysis and Review Engine", width=5.4)

    add_para(doc, "The Level 1 DFD delineates five core processes: (1.0) Authentication & Token Verification; (2.0) Ephemeral ZIP Ingestion & Sanitization; (3.0) Static Heuristic Parsing; (4.0) Structured Prompt Trimming; and (5.0) AI Semantic Review Synthesis. Data stores include DS-1 (Users), DS-2 (Projects), DS-3 (Project Analyses), and DS-4 (Code Reviews).")

    add_heading1(doc, "6.5 INFORMATION MODELING: ENTITY-RELATIONSHIP DIAGRAM (ERD)")
    add_para(doc, "The conceptual and logical data schema of UDIH is modeled via the Entity-Relationship Diagram shown in Figure 6.5.")

    # Figure 6.5
    fig_er_path = os.path.join(doc_dir, "fig_er_diagram.png")
    add_figure(doc, fig_er_path, "Figure 6.5: Entity-Relationship (ER) Diagram of UDIH MongoDB Persistence Models", width=5.4)

    add_para(doc, "The persistence tier defines six primary collections: User, Project, ProjectAnalysis, CodeReview, ActivityLog, and HeartbeatPresence. A User entity has a 1-to-Many relationship with Projects and ActivityLogs. A Project entity has a 1-to-1 relationship with ProjectAnalysis (representing the latest static metrics) and a 1-to-Many relationship with CodeReviews, establishing comprehensive auditability and version tracking.")

    add_heading1(doc, "6.6 MULTI-STAGE PIPELINE EXECUTION LIFECYCLE")
    add_para(doc, "The project lifecycle progresses through discrete state transitions: UPLOADED -> EXTRACTING -> STATIC_ANALYZING -> STATIC_COMPLETED -> AI_PENDING -> AI_REVIEWING -> READY / COMPLETED. Each transition emits telemetry updates, enabling real-time user interface progress tracking.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 7: SYSTEM IMPLEMENTATION AND MODULE SPECIFICATIONS
    # =========================================================================
    add_chapter_heading(doc, "CHAPTER 7\nSYSTEM IMPLEMENTATION AND MODULE SPECIFICATIONS")

    add_heading1(doc, "7.1 TECHNOLOGY STACK AND IMPLEMENTATION ENVIRONMENT")
    add_para(doc, "The UDIH platform is constructed using modern, production-hardened software frameworks across all tiers, as detailed in Table 7.1.")

    # Table 7.1
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 7.1: Core Technology Stack, Libraries, and Implementation Rationale", bold=True, size=10.5)

    stack_table = doc.add_table(rows=8, cols=4)
    stack_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in stack_table.rows:
        r.cells[0].width = Inches(1.2)
        r.cells[1].width = Inches(1.5)
        r.cells[2].width = Inches(1.1)
        r.cells[3].width = Inches(2.7)

    headers = ["Layer", "Technology / Framework", "Version", "Engineering Rationale & Functional Scope"]
    for j, h in enumerate(headers):
        c = stack_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    stack_list = [
        ("Frontend UI", "React", "19.0.0", "Declarative component hierarchy, virtual DOM, concurrent rendering."),
        ("Styling", "Tailwind CSS", "3.4.1", "Utility-first CSS framework enabling responsive enterprise UI design."),
        ("Build Tool", "Vite", "6.0.1", "High-performance ESM-based development server and rollup packager."),
        ("Backend Server", "Node.js / Express", "5.0.0", "Asynchronous non-blocking event-driven API runtime."),
        ("Database / ODM", "MongoDB Atlas / Mongoose", "8.2.0", "Flexible JSON document persistence with schema validation."),
        ("AI Foundation", "Google GenAI SDK", "0.2.1", "Native SDK for Gemini 2.5 Flash and Gemini 1.5 Pro APIs."),
        ("Archive Engine", "Adm-Zip", "0.5.16", "Memory-efficient synchronous/asynchronous ZIP decompression.")
    ]
    for i, row in enumerate(stack_list):
        r = stack_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j in [0, 2]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, bold=(j==0), size=8)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, size=8)

    style_table_borders(stack_table)

    add_heading1(doc, "7.2 INGESTION ENGINE: EPHEMERAL DIRECTORY SANDBOXING & ZIP EXTRACTION")
    add_para(doc, "The archive ingestion module (`src/services/zipExtractor.js`) manages file ingestion with stringent security controls. When an archive is uploaded via Multer, the file stream is written to a transient directory. The extractor validates that the file header corresponds to standard PKZIP specifications.")

    add_para(doc, "To neutralize the Zip Slip vulnerability, every entry's target destination is evaluated using `path.resolve(sandboxRoot, entry.entryName)`. If the resolved absolute path does not start with `sandboxRoot + path.sep`, the extraction process terminates immediately with an HTTP 400 Security Exception. Files exceeding individual size thresholds (5 MB uncompressed) or belonging to blacklisted binary extensions (.exe, .dll, .bin, .so) are skipped, preventing decompression bombs.")

    # Screenshot Figure 7.1 (Analyzing Progress)
    shot_prog = os.path.join(doc_dir, "screenshot_analyzing.png")
    add_figure(doc, shot_prog, "Figure 7.1: Real-Time Ephemeral Ingestion and Decompression Progress Monitor", width=5.0)

    add_para(doc, "Figure 7.1 depicts the live project ingestion interface during the active decompression and file processing phase. The system renders an animated progress percentage alongside real-time step telemetry ('Analyzing Files... 40% (1/4 files processed)'), providing developers with transparent visual feedback.")

    add_heading1(doc, "7.3 STATIC CODE ANALYZER ENGINE: HEURISTICS, AST TRAVERSAL & SCORING")
    add_para(doc, "The Static Code Analyzer (`src/services/codeAnalyzer.js`) parses source code files across polyglot languages. For each file, the analyzer measures physical lines of code (LOC), single-line comments, block comments, and logical code lines. Cyclomatic complexity proxies are evaluated by counting decision keywords (`if`, `else if`, `for`, `while`, `catch`, `case`, `&&`, `||`).")

    add_para(doc, "Security heuristics scan for hardcoded credentials using targeted regex patterns matching AWS access keys, JWT tokens, private RSA blocks, and database connection strings. The Maintainability Index (MI) is calibrated on a 0-100 scale using an adapted Halstead and McCabe metric:")
    add_para(doc, "MI = MAX(0, (171 - 5.2 * ln(HalsteadVolume) - 0.23 * CyclomaticComplexity - 16.2 * ln(LOC)) * 100 / 171)")

    # Screenshot Figure 7.2 (Architecture Tab)
    shot_arch = os.path.join(doc_dir, "screenshot_architecture.png")
    add_figure(doc, shot_arch, "Figure 7.2: Extracted System Architecture, Pattern Classification, and Key Relationship Mapping", width=5.0)

    add_para(doc, "As shown in Figure 7.2, the Static Code Analyzer automatically deduces the high-level Architectural Pattern (e.g., Client-Server), maps individual tiers (Frontend React SPA, Backend Node.js Express server), and automatically extracts Key Component Relationships (e.g., `frontend/src/App.js imports frontend/api.js`, `backend/server.js uses backend/api/routes.js`).")

    add_heading1(doc, "7.4 AI INTELLIGENCE AND REVIEW MODULE: GEMINI 2.5 FLASH INTEGRATION")
    add_para(doc, "The AI review module (`src/services/geminiService.js`) orchestrates interaction with Google Gemini models. The module accepts the structured project context generated by the AST trimmer and constructs a comprehensive system prompt mandating structured JSON output.")

    # Screenshot Figure 7.3 (Project Overview Tab)
    shot_over = os.path.join(doc_dir, "screenshot_overview.png")
    add_figure(doc, shot_over, "Figure 7.3: Project Intelligence Overview with Calibrated Quality Score (80/100)", width=5.0)

    add_para(doc, "Figure 7.3 demonstrates the Project Intelligence Overview dashboard rendered upon review completion. The platform displays the calibrated Quality Score badge (80/100), concise natural-language Project Summary, end-to-end Data Flow breakdown, and actionable architectural recommendations.")

    add_heading1(doc, "7.5 AUTHENTICATION, SESSION SECURITY & REAL-TIME HEARTBEAT DAEMON")
    add_para(doc, "The authentication controller (`src/controllers/authController.js`) handles user registration, login, and session validation. Passwords are never stored in plaintext; they are hashed using bcrypt with 10 salt rounds. During login, email addresses are normalized to lowercase, and credentials are authenticated using constant-time string comparisons to resist timing attacks.")

    # Screenshot Figure 7.4 (Login Portal)
    shot_login = os.path.join(doc_dir, "screenshot_login.png")
    add_figure(doc, shot_login, "Figure 7.4: Production Authentication and Login Portal with Role Validation", width=3.4)

    add_para(doc, "Figure 7.4 shows the production UDIH login screen. Authentication failures prompt an immediate, secure contextual banner ('Authentication failed. Please verify credentials.') without revealing whether the email or password was invalid, mitigating account enumeration vulnerabilities.")

    # Table 7.2
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_run(p, "Table 7.2: MongoDB Collections, Field Types, Indexing, and Isolation Keys", bold=True, size=10.5)

    schema_table = doc.add_table(rows=6, cols=4)
    schema_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in schema_table.rows:
        r.cells[0].width = Inches(1.3)
        r.cells[1].width = Inches(2.2)
        r.cells[2].width = Inches(1.5)
        r.cells[3].width = Inches(1.5)

    headers = ["Collection Name", "Primary Fields & Types", "Indexes & Constraints", "Data Isolation Key"]
    for j, h in enumerate(headers):
        c = schema_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_run(c.paragraphs[0], h, bold=True, size=9)

    schema_list = [
        ("User", "email (String), password (String), role (String), lastActiveAt (Date)", "Unique Index on email", "Global / Id"),
        ("Project", "name (String), owner (ObjectId), status (String), healthScore (Number)", "Index on owner, createdAt", "owner (User Ref)"),
        ("ProjectAnalysis", "project (ObjectId), loc (Number), files (Array), metrics (Object)", "Unique Index on project", "project (Project Ref)"),
        ("CodeReview", "project (ObjectId), reviewer (String), critique (Object), diffs (Array)", "Index on project, createdAt", "project (Project Ref)"),
        ("ActivityLog", "user (ObjectId), action (String), ipAddress (String), timestamp (Date)", "TTL Index on timestamp", "user (User Ref)")
    ]
    for i, row in enumerate(schema_list):
        r = schema_table.rows[i+1]
        for j, val in enumerate(row):
            p = r.cells[j].paragraphs[0]
            if j in [0, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                add_run(p, val, bold=(j==0), size=8)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_run(p, val, size=8)

    style_table_borders(schema_table)

    add_heading1(doc, "7.6 DASHBOARD ANALYTICS ENGINE: AGGREGATIONS & DATA ISOLATION")
    add_para(doc, "The analytics service (`src/controllers/analyticsController.js`) utilizes high-performance MongoDB aggregation pipelines to compute 30-day activity trends, analysis volumes, and language distributions. To guarantee strict multi-tenant data isolation, every aggregation query begins with a mandatory `$match: { owner: req.user._id }` pipeline stage for Developer accounts.")

    add_para(doc, "This prevents accidental data leakage between corporate tenants. For newly registered users with zero uploaded projects, the aggregation pipeline returns a clean empty dataset, preventing phantom score rendering bugs.")

    add_heading1(doc, "7.7 ADMINISTRATION PORTAL, SYSTEM HEALTH UI & USER LIFECYCLE")
    add_para(doc, "The Settings and Administration console provides platform-wide oversight. Administrators can inspect active sessions, verify AI provider connectivity, monitor system health, and review security audit logs.")

    # Screenshot Figure 7.5 (Settings & Health)
    shot_sett = os.path.join(doc_dir, "screenshot_settings.png")
    add_figure(doc, shot_sett, "Figure 7.5: Enterprise Settings and AI Provider Health Monitoring Interface", width=5.0)

    add_para(doc, "Figure 7.5 illustrates the live System Health and AI Configuration dashboard. The interface confirms active Google Gemini API integration ('Online Mode'), Backend Server operational status ('Running'), and active MongoDB database connection ('Connected'), guaranteeing high transparency.")

    print("Chapters 5 to 7 updated successfully with diagrams and real UI screenshots.")
