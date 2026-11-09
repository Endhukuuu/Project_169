# report_sections_prelim.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os

def add_preliminary_pages(doc, doc_dir, helpers):
    add_para = helpers['add_para']
    add_heading1 = helpers['add_heading1']
    add_heading2 = helpers['add_heading2']
    logo_path = os.path.join(doc_dir, "sru_logo.png")

    # =========================================================================
    # PAGE 1: TITLE PAGE (No page number printed)
    # =========================================================================
    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=12)
    helpers['add_run'](p, "THE UNIFIED DEVELOPER INTELLIGENCE HUB COMBINING ENTERPRISE DATA ANALYTICS, SEMANTIC CODE UNDERSTANDING, AND AI-POWERED COLLABORATIVE CODE REVIEW", bold=True, size=14)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    helpers['add_run'](p, "A Capstone Project report submitted", italic=True, size=12)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=12)
    helpers['add_run'](p, "in partial fulfillment of requirement for the award of degree", italic=True, size=12)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=2)
    helpers['add_run'](p, "BACHELOR OF TECHNOLOGY", bold=True, size=13)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2)
    helpers['add_run'](p, "in", italic=True, size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=14)
    helpers['add_run'](p, "SCHOOL OF COMPUTER SCIENCE AND ARTIFICIAL INTELLIGENCE", bold=True, size=12)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=8)
    helpers['add_run'](p, "by", italic=True, size=11)

    table = doc.add_table(rows=5, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    students = [
        ("Harsh", "2303A51105"),
        ("Anand", "2303A51090"),
        ("Aneesh", "2303A51120"),
        ("Vishwanath", "2303A51095"),
        ("Bharath", "2303A51097")
    ]
    for i, (name, roll) in enumerate(students):
        r = table.rows[i]
        r.cells[0].width = Inches(2.5)
        r.cells[1].width = Inches(2.5)
        p0 = r.cells[0].paragraphs[0]
        helpers['format_para'](p0, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=1, space_after=1)
        helpers['add_run'](p0, name, bold=True, size=11)
        p1 = r.cells[1].paragraphs[0]
        helpers['format_para'](p1, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=1, space_after=1)
        helpers['add_run'](p1, f"({roll})", bold=True, size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=2)
    helpers['add_run'](p, "Under the guidance of", italic=True, size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=2)
    helpers['add_run'](p, "[Guide Name / Faculty Mentor]", bold=True, size=12)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=12)
    helpers['add_run'](p, "Assistant / Associate Professor, School of CS&AI", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=8)
    p.add_run().add_picture(logo_path, width=Inches(1.5))

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=2)
    helpers['add_run'](p, "SR UNIVERSITY", bold=True, size=13)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=0)
    helpers['add_run'](p, "Ananthasagar, Warangal, Telangana - 506371", size=11)

    doc.add_page_break()

    # =========================================================================
    # PAGE 2: CERTIFICATE (No page number printed)
    # =========================================================================
    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2)
    helpers['add_run'](p, "SR University", bold=True, size=16)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6)
    helpers['add_run'](p, "Ananthasagar, Warangal - 506371", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=8)
    p.add_run().add_picture(logo_path, width=Inches(1.4))

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=14)
    helpers['add_run'](p, "CERTIFICATE", bold=True, size=16)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=14, line_spacing=1.5)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, 'This is to certify that this project entitled ', size=12)
    helpers['add_run'](p, '"THE UNIFIED DEVELOPER INTELLIGENCE HUB COMBINING ENTERPRISE DATA ANALYTICS, SEMANTIC CODE UNDERSTANDING, AND AI-POWERED COLLABORATIVE CODE REVIEW"', bold=True, size=12)
    helpers['add_run'](p, ' is the bonafide work carried out by ', size=12)
    helpers['add_run'](p, 'Harsh (2303A51105), Anand (2303A51090), Aneesh (2303A51120), Vishwanath (2303A51095), and Bharath (2303A51097)', bold=True, size=12)
    helpers['add_run'](p, ' as a Capstone Project for the partial fulfillment to award the degree ', size=12)
    helpers['add_run'](p, 'BACHELOR OF TECHNOLOGY', bold=True, size=12)
    helpers['add_run'](p, ' in ', size=12)
    helpers['add_run'](p, 'School of Computer Science and Artificial Intelligence', bold=True, size=12)
    helpers['add_run'](p, ' during the academic year 2026-2027 under our guidance and supervision.', size=12)

    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in sig_table.rows:
        r.cells[0].width = Inches(2.8)
        r.cells[1].width = Inches(2.8)

    p_left = sig_table.rows[0].cells[0].paragraphs[0]
    helpers['format_para'](p_left, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=24, space_after=2, line_spacing=1.15)
    helpers['add_run'](p_left, "[Guide Name / Faculty Mentor]\n", bold=True, size=11)
    helpers['add_run'](p_left, "Assistant / Associate Professor,\n", size=10)
    helpers['add_run'](p_left, "School of CS&AI,\n", size=10)
    helpers['add_run'](p_left, "SR University,\n", size=10)
    helpers['add_run'](p_left, "Ananthasagar, Warangal.", size=10)

    p_right = sig_table.rows[0].cells[1].paragraphs[0]
    helpers['format_para'](p_right, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=24, space_after=2, line_spacing=1.15)
    helpers['add_run'](p_right, "Dr. CH. Sandeep\n", bold=True, size=11)
    helpers['add_run'](p_right, "Associate Professor & Head,\n", size=10)
    helpers['add_run'](p_right, "School of CS&AI,\n", size=10)
    helpers['add_run'](p_right, "SR University,\n", size=10)
    helpers['add_run'](p_right, "Ananthasagar, Warangal.", size=10)

    p = doc.add_paragraph()
    helpers['format_para'](p, space_before=16, space_after=4)

    rev_table = doc.add_table(rows=1, cols=2)
    rev_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in rev_table.rows:
        r.cells[0].width = Inches(2.8)
        r.cells[1].width = Inches(2.8)

    p_rev1 = rev_table.rows[0].cells[0].paragraphs[0]
    helpers['format_para'](p_rev1, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=8, space_after=2, line_spacing=1.15)
    helpers['add_run'](p_rev1, "Reviewer - 1\n", bold=True, size=11)
    helpers['add_run'](p_rev1, "Name: ___________________________\n", size=10)
    helpers['add_run'](p_rev1, "Designation: ____________________\n", size=10)
    helpers['add_run'](p_rev1, "Signature: ______________________", size=10)

    p_rev2 = rev_table.rows[0].cells[1].paragraphs[0]
    helpers['format_para'](p_rev2, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=8, space_after=2, line_spacing=1.15)
    helpers['add_run'](p_rev2, "Reviewer - 2\n", bold=True, size=11)
    helpers['add_run'](p_rev2, "Name: ___________________________\n", size=10)
    helpers['add_run'](p_rev2, "Designation: ____________________\n", size=10)
    helpers['add_run'](p_rev2, "Signature: ______________________", size=10)

    # Transition to Section 2: Preliminary Roman Pages (NO redundant page break before NEW_PAGE section break!)
    s2 = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    s2.top_margin = Inches(1.0)
    s2.bottom_margin = Inches(1.0)
    s2.left_margin = Inches(1.5)
    s2.right_margin = Inches(1.0)
    s2.header.is_linked_to_previous = False
    s2.footer.is_linked_to_previous = False
    p_foot = s2.footer.paragraphs[0]
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_foot._p.append(parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>'))
    s2._sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman" w:start="3"/>'))

    # =========================================================================
    # PAGE iii: DECLARATION BY CANDIDATES
    # =========================================================================
    helpers['add_chapter_heading'](doc, "DECLARATION")
    
    add_para(doc, "We hereby declare that the Capstone Project report entitled \"The Unified Developer Intelligence Hub Combining Enterprise Data Analytics, Semantic Code Understanding, and AI-Powered Collaborative Code Review\" submitted to the School of Computer Science and Artificial Intelligence, SR University, Warangal, is an authentic record of original engineering research and software implementation carried out by us under faculty guidance and supervision.")
    
    add_para(doc, "We further confirm that this work has not been submitted previously to any other university, institute, or degree-granting entity for the award of any degree, diploma, fellowship, or commercial certificate. All secondary sources of information, research papers, third-party libraries, and analytical frameworks utilized during the development of this platform have been properly credited and cited in the references section of this report.")
    
    add_para(doc, "Furthermore, we confirm that all system implementations, source code repositories, architectural designs, automated code analyzers, and database migration models presented in this thesis represent genuine, functioning software artifacts engineered during the 2026-2027 academic session.")

    p = doc.add_paragraph()
    helpers['format_para'](p, space_before=18, space_after=8)
    helpers['add_run'](p, "Place: Ananthasagar, Warangal\nDate: 05 November 2026", size=11)

    decl_table = doc.add_table(rows=6, cols=3)
    decl_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Candidate Name", "Hall Ticket / Roll No.", "Signature"]
    for j, h in enumerate(headers):
        c = decl_table.rows[0].cells[j]
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        helpers['add_run'](c.paragraphs[0], h, bold=True, size=10)
    
    cand_info = [
        ("Harsh", "2303A51105"),
        ("Anand", "2303A51090"),
        ("Aneesh", "2303A51120"),
        ("Vishwanath", "2303A51095"),
        ("Bharath", "2303A51097")
    ]
    for i, (name, roll) in enumerate(cand_info):
        r = decl_table.rows[i+1]
        r.cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT
        helpers['add_run'](r.cells[0].paragraphs[0], name, size=10)
        r.cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        helpers['add_run'](r.cells[1].paragraphs[0], roll, size=10)
        r.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        helpers['add_run'](r.cells[2].paragraphs[0], "_______________________", size=10)
    helpers['style_table_borders'](decl_table)

    doc.add_page_break()

    # =========================================================================
    # PAGE iv: ACKNOWLEDGEMENTS (Calibrated to fit cleanly on 1 page)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "ACKNOWLEDGEMENTS")

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.35)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "The completion of this Capstone Project report and the successful engineering of the Unified Developer Intelligence Hub (UDIH) has been an enriching academic and engineering journey. We wish to express our profound gratitude to all individuals and institutions whose guidance, constructive criticism, and encouragement made this work possible.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.35)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "First and foremost, we express our sincere and heartfelt gratitude to our Faculty Guide and Mentor, [Guide Name / Faculty Mentor], Assistant / Associate Professor, School of Computer Science and Artificial Intelligence, for their constant guidance, insightful perspectives, and technical mentorship throughout the design, implementation, and refinement stages of this project.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.35)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "We express our sincere thanks to Dr. CH. Sandeep, Associate Professor and Head, School of Computer Science and Artificial Intelligence, SR University, for fostering a forward-thinking academic environment, providing world-class laboratory facilities, and motivating us to undertake complex, full-scale software engineering challenges.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.35)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "We extend our deep appreciation to the honorable Vice-Chancellor, Dean of Engineering, and the academic administration of SR University for their vision, continuous support, and provision of the state-of-the-art technological ecosystem that empowered our development work.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.35)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "Our special thanks are also due to the technical reviewers and laboratory technicians of the School of CS&AI for their constructive feedback during periodic reviews. Finally, we express our deepest personal appreciation to our parents, family members, and classmates for their moral support and understanding throughout our engineering curriculum.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=10, space_after=2)
    helpers['add_run'](p, "Harsh (2303A51105)  |  Anand (2303A51090)  |  Aneesh (2303A51120)\nVishwanath (2303A51095)  |  Bharath (2303A51097)", bold=True, size=10)

    doc.add_page_break()

    # =========================================================================
    # PAGE v: ABSTRACT (Calibrated to fit cleanly on 1 page without spilling)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "ABSTRACT")

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.3)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "Modern software engineering organizations face significant friction in maintaining code quality, enforcing structural maintainability, and providing prompt, context-rich code review feedback across rapidly scaling distributed codebases. While classical static analysis tools provide deterministic rule checking, they lack semantic comprehension, fail to understand architectural intent, and generate excessive false positives. Conversely, standalone generative AI solutions suffer from context window saturation, token truncation errors, data leakage, and lack of deterministic grounding in actual project metrics.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.3)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "To resolve this critical industry divide, this Capstone Project presents the Unified Developer Intelligence Hub (UDIH)—an enterprise-grade, multi-user, AI-powered developer intelligence and collaborative code analysis platform. UDIH introduces a novel hybrid intelligence paradigm combining deterministic static heuristic analysis with dual-model generative semantic reasoning. The system ingests zipped repository archives into an ephemeral sandboxed directory, applies multi-level path traversal sanitization, and extracts abstract syntactic structures across polyglot source trees.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.3)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "The platform's static analysis engine evaluates code maintainability, cyclomatic complexity patterns, and vulnerability heuristics across JavaScript, TypeScript, Python, Java, C++, and Go. Simultaneously, an AST-aware structured context trimmer prunes low-entropy syntax while preserving function boundaries and semantic identifiers, overcoming conventional character limits. The processed representation is evaluated through a dual-model resilience architecture featuring Google Gemini 2.5 Flash as the primary reasoning engine with automatic fallback to Gemini 1.5 Pro upon API rate limiting or quota exhaustion.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.3)
    p.paragraph_format.first_line_indent = Inches(0.5)
    helpers['add_run'](p, "UDIH is architected on a decoupled full-stack infrastructure utilizing React 19, Tailwind CSS, Express 5, and a dual-mode persistence layer coupling MongoDB Atlas with automated local daemon failover. A real-time heartbeat daemon tracks user presence, while JWT-based stateless authentication enforces strict role-based access control (Admin, Developer) and multi-tenant project isolation. Empirical testing demonstrates a 100% test pass rate across 15 formal verification scenarios, sub-second static analysis latency, and a 68% reduction in prompt token bloat while maintaining zero data leakage.", size=11)

    p = doc.add_paragraph()
    helpers['format_para'](p, space_before=8, space_after=2)
    helpers['add_run'](p, "Keywords: ", bold=True, size=10.5)
    helpers['add_run'](p, "Developer Intelligence, Static Code Analysis, Large Language Models, Google Gemini API, Semantic Code Review, MongoDB Atlas, AST Context Truncation, Role-Based Access Control, Software Quality Metrics.", italic=True, size=10)

    doc.add_page_break()

    # =========================================================================
    # PAGES vi-viii: TABLE OF CONTENTS (Clean table formatted without spills)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "TABLE OF CONTENTS")

    toc_items = [
        ("Title Page", "-", "i"),
        ("Certificate", "-", "ii"),
        ("Declaration", "-", "iii"),
        ("Acknowledgements", "-", "iv"),
        ("Abstract", "-", "v"),
        ("Table of Contents", "-", "vi"),
        ("List of Figures", "-", "viii"),
        ("List of Tables", "-", "ix"),
        ("List of Acronyms", "-", "x"),
        ("CHAPTER 1", "INTRODUCTION OF PROJECT", "1"),
        ("1.1", "Background and Problem Context", "1"),
        ("1.2", "Evolution of Software Engineering and Developer Intelligence", "1"),
        ("1.3", "Overview of the Unified Developer Intelligence Hub (UDIH)", "2"),
        ("1.4", "Objectives of the Project", "3"),
        ("1.5", "Scope and Operational Boundaries", "4"),
        ("1.6", "Report Organization", "4"),
        ("CHAPTER 2", "LITERATURE SURVEY AND RELATED WORK", "6"),
        ("2.1", "Classical Static Code Analysis Frameworks", "6"),
        ("2.2", "Deep Learning and Transformers in Software Engineering", "6"),
        ("2.3", "Large Language Models for Automated Code Review", "7"),
        ("2.4", "Multi-Tenant Developer Platforms and Security Paradigms", "8"),
        ("2.5", "Critical Comparative Analysis of Existing Solutions", "8"),
        ("2.6", "Identification of Research and Engineering Gaps", "9"),
        ("CHAPTER 3", "PROBLEM STATEMENT AND ENGINEERING OBJECTIVES", "10"),
        ("3.1", "Problem Definition in Modern Enterprise Codebases", "10"),
        ("3.2", "Context Window Saturation and Information Leakage Challenges", "10"),
        ("3.3", "Need for a Hybrid Static-Heuristic and Generative Paradigm", "11"),
        ("3.4", "Core Engineering Goals and Success Criteria", "11"),
        ("3.5", "Expected Engineering and Societal Outcomes", "12"),
        ("CHAPTER 4", "REQUIREMENT ANALYSIS, FEASIBILITY, AND RISK ASSESSMENT", "13"),
        ("4.1", "Stakeholder Profiles and Persona Analysis", "13"),
        ("4.2", "Functional Requirements Specification (FR-01 to FR-15)", "13"),
        ("4.3", "Non-Functional Requirements Specification (NFR-01 to NFR-08)", "14"),
        ("4.4", "Comprehensive Feasibility Analysis", "15"),
        ("4.5", "Risk Assessment, Hazard Analysis, and Mitigation Strategies", "15"),
        ("4.6", "Development Methodology and Iterative Sprint Execution", "16"),
        ("CHAPTER 5", "SYSTEM ARCHITECTURE AND PROPOSED METHODOLOGY", "16"),
        ("5.1", "High-Level Architectural Paradigm", "16"),
        ("5.2", "Tiered Layer Decomposition and Service Boundaries", "17"),
        ("5.3", "Decoupled Service Architecture: Analysis vs. Collaborative Review", "18"),
        ("5.4", "Dual-Model AI Resilience Framework", "18"),
        ("5.5", "Dual-Mode Persistence Architecture: MongoDB Atlas & Local Failover", "19"),
        ("5.6", "Structured Prompt Truncation & AST Context Preservation", "19"),
        ("5.7", "Security Architecture: JWT Auth, RBAC, and Ephemeral Sandboxing", "20"),
        ("CHAPTER 6", "SYSTEM DESIGN, UML MODELING, AND DATA WORKFLOWS", "22"),
        ("6.1", "Use Case Modeling and Actor Interaction Analysis", "22"),
        ("6.2", "Dynamic Behavioral Modeling: Sequence Diagrams", "23"),
        ("6.3", "Workflow Modeling: Activity Diagrams", "23"),
        ("6.4", "Data Flow Modeling (Level 0 Context, Level 1 Process DFD)", "24"),
        ("6.5", "Information Modeling: Entity-Relationship Diagram (ERD)", "25"),
        ("6.6", "Multi-Stage Pipeline Execution Lifecycle", "26"),
        ("CHAPTER 7", "SYSTEM IMPLEMENTATION AND MODULE SPECIFICATIONS", "27"),
        ("7.1", "Technology Stack and Implementation Environment", "27"),
        ("7.2", "Ingestion Engine: Ephemeral Sandboxing & Real-Time Extraction UI", "27"),
        ("7.3", "Static Code Analyzer Engine: Heuristics & Architectural Mapping UI", "28"),
        ("7.4", "AI Intelligence Module: Gemini 2.5 Flash & Project Overview UI", "29"),
        ("7.5", "Authentication, Session Security & Portal Login UI", "30"),
        ("7.6", "Dashboard Analytics Engine: Aggregations & Data Isolation", "32"),
        ("7.7", "Administration Portal, System Health UI & User Lifecycle", "32"),
        ("CHAPTER 8", "SIMULATION SETUP, VERIFICATION, AND TEST EVIDENCE", "33"),
        ("8.1", "Verification and Validation Framework", "33"),
        ("8.2", "Formal Test Suite Execution (15 Verified Scenarios)", "33"),
        ("8.3", "Security Audit: Injection, Traversal, and RBAC Penetration Testing", "34"),
        ("8.4", "Performance Profiling, Latency, and Throughput Benchmarks", "35"),
        ("8.5", "Verified Test Execution Transcripts and Log Evidence", "35"),
        ("CHAPTER 9", "EXPERIMENTAL RESULTS, PERFORMANCE EVALUATION, AND DISCUSSION", "36"),
        ("9.1", "Static Analysis Accuracy vs. AI Semantic Depth", "36"),
        ("9.2", "Token Efficiency and Cost Optimization Analysis", "36"),
        ("9.3", "Health Score Calibration and Deterministic Repeatability", "37"),
        ("9.4", "Enterprise Analytics Telemetry & Real-Time Dashboard UI", "37"),
        ("9.5", "Discussion of Findings and Industrial Viability", "39"),
        ("CHAPTER 10", "LEARNING OUTCOMES, REFLECTIONS, AND TEAM CONTRIBUTIONS", "40"),
        ("10.1", "Technical Competencies and Domain Knowledge Gained", "40"),
        ("10.2", "Software Engineering Best Practices and Collaborative Work", "40"),
        ("10.3", "Comprehensive Individual Team Member Contribution Matrix", "41"),
        ("10.4", "Mapping to Program Outcomes (POs) and PSOs", "41"),
        ("CHAPTER 11", "CONCLUSION, LIMITATIONS, AND FUTURE ROADMAP", "42"),
        ("11.1", "Project Summary and Value Delivered", "42"),
        ("11.2", "Current System Limitations and Edge Cases", "42"),
        ("11.3", "Future Engineering and Research Roadmap", "43"),
        ("11.4", "Concluding Remarks", "43"),
        ("REFERENCES", "IEEE / ACM Academic and Technical Citations", "44"),
        ("APPENDIX A", "REST API Specification and Data Contracts", "46"),
        ("APPENDIX B", "Google Gemini Prompts and Output JSON Schemas", "47"),
        ("APPENDIX C", "System Deployment, Configuration, and Operation Runbook", "48")
    ]

    toc_table = doc.add_table(rows=len(toc_items)+1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in toc_table.rows:
        r.cells[0].width = Inches(1.3)
        r.cells[1].width = Inches(4.3)
        r.cells[2].width = Inches(0.8)
    
    h_row = toc_table.rows[0]
    helpers['add_run'](h_row.cells[0].paragraphs[0], "SECTION / CH.", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[1].paragraphs[0], "TITLE / DESCRIPTION", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[2].paragraphs[0], "PAGE", bold=True, size=9.5)
    h_row.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

    for idx, (col1, col2, col3) in enumerate(toc_items):
        row = toc_table.rows[idx+1]
        p1 = row.cells[0].paragraphs[0]
        p2 = row.cells[1].paragraphs[0]
        p3 = row.cells[2].paragraphs[0]
        helpers['format_para'](p1, space_before=1, space_after=1, line_spacing=1.0)
        helpers['format_para'](p2, space_before=1, space_after=1, line_spacing=1.0)
        helpers['format_para'](p3, space_before=1, space_after=1, line_spacing=1.0)
        
        is_bold = col1.startswith("CHAPTER") or col1 in ["Title Page", "Certificate", "Declaration", "Acknowledgements", "Abstract", "Table of Contents", "List of Figures", "List of Tables", "List of Acronyms", "REFERENCES", "APPENDIX A", "APPENDIX B", "APPENDIX C"]
        
        helpers['add_run'](p1, col1, bold=is_bold, size=9)
        helpers['add_run'](p2, col2, bold=is_bold, size=9)
        p3.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        helpers['add_run'](p3, col3, bold=is_bold, size=9)

    helpers['style_table_borders'](toc_table)

    doc.add_page_break()

    # =========================================================================
    # PAGE viii: LIST OF FIGURES (Synchronized with Section 3 Physical Page Numbers)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "LIST OF FIGURES")

    figures = [
        ("Figure 5.1", "High-Level Tiered System Architecture of UDIH", "17"),
        ("Figure 5.2", "Five-Stage Analysis Pipeline & Dual-Model Resilience Flowchart", "19"),
        ("Figure 6.1", "Unified Use Case Diagram for Developer and Administrator Roles", "22"),
        ("Figure 6.2", "System Sequence Diagram for Ingestion, Analysis, and AI Review", "23"),
        ("Figure 6.3", "Activity Diagram for Multi-Stage Pipeline Execution Lifecycle", "24"),
        ("Figure 6.4", "Level 1 Data Flow Diagram (DFD) for Code Analysis and Review Engine", "24"),
        ("Figure 6.5", "Entity-Relationship (ER) Diagram of UDIH MongoDB Persistence Models", "25"),
        ("Figure 7.1", "Real-Time Ephemeral Ingestion and Decompression Progress Monitor", "28"),
        ("Figure 7.2", "Extracted System Architecture, Pattern Classification & Key Relationships UI", "29"),
        ("Figure 7.3", "Project Intelligence Overview with Calibrated Quality Score (80/100)", "30"),
        ("Figure 7.4", "Production Authentication and Login Portal with Role Validation", "31"),
        ("Figure 7.5", "Enterprise Settings & AI Provider Health Monitoring Interface", "32"),
        ("Figure 9.1", "30-Day Analysis Activity Trend Graph in Enterprise Dashboard", "37"),
        ("Figure 9.2", "30-Day Total Project Analysis Volume Bar Distribution Chart", "38"),
        ("Figure 9.3", "Enterprise Data Analytics Dashboard with Issue Severity & Metric Totals", "38")
    ]

    fig_table = doc.add_table(rows=len(figures)+1, cols=3)
    fig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in fig_table.rows:
        r.cells[0].width = Inches(1.4)
        r.cells[1].width = Inches(4.2)
        r.cells[2].width = Inches(0.8)

    h_row = fig_table.rows[0]
    helpers['add_run'](h_row.cells[0].paragraphs[0], "FIGURE NO.", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[1].paragraphs[0], "FIGURE CAPTION / TITLE", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[2].paragraphs[0], "PAGE", bold=True, size=9.5)
    h_row.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

    for idx, (num, title, page) in enumerate(figures):
        row = fig_table.rows[idx+1]
        helpers['format_para'](row.cells[0].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['format_para'](row.cells[1].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['format_para'](row.cells[2].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['add_run'](row.cells[0].paragraphs[0], num, bold=True, size=9)
        helpers['add_run'](row.cells[1].paragraphs[0], title, size=9)
        p3 = row.cells[2].paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        helpers['add_run'](p3, page, size=9)

    helpers['style_table_borders'](fig_table)

    doc.add_page_break()

    # =========================================================================
    # PAGE ix: LIST OF TABLES (Synchronized with Section 3 Physical Page Numbers)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "LIST OF TABLES")

    tables = [
        ("Table 2.1", "Comparative Evaluation of Industry Code Quality & AI Platforms", "8"),
        ("Table 4.1", "Comprehensive Functional Requirements Specification (FR-01 to FR-15)", "13"),
        ("Table 4.2", "Non-Functional Requirements Specification (NFR-01 to NFR-08)", "14"),
        ("Table 4.3", "Risk Identification, Severity Matrix, and Engineered Mitigations", "15"),
        ("Table 7.1", "Core Technology Stack, Libraries, and Implementation Rationale", "27"),
        ("Table 7.2", "MongoDB Collections, Field Types, Indexing, and Isolation Keys", "31"),
        ("Table 8.1", "Formal Test Cases Suite and Empirical Verification Results (TC-01 to TC-15)", "33"),
        ("Table 8.2", "Security Penetration Audit and Defensive Controls Verification", "34"),
        ("Table 8.3", "Benchmarking Profile: Repository Ingestion, Analysis, and AI Response Latency", "35"),
        ("Table 9.1", "Comparative Performance: Raw 15k Character Limit vs. AST Structured Truncation", "36"),
        ("Table 9.2", "Health Score Calibration Metric Weights and Heuristic Deductions", "37"),
        ("Table 10.1", "Comprehensive Individual Team Member Contribution Matrix", "41"),
        ("Table 10.2", "Mapping of Project Work to CS&AI Program Outcomes (POs and PSOs)", "41"),
        ("Table A.1", "REST API Endpoint Specifications, HTTP Verbs, and Access Control Levels", "46")
    ]

    tbl_table = doc.add_table(rows=len(tables)+1, cols=3)
    tbl_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_table.rows:
        r.cells[0].width = Inches(1.4)
        r.cells[1].width = Inches(4.2)
        r.cells[2].width = Inches(0.8)

    h_row = tbl_table.rows[0]
    helpers['add_run'](h_row.cells[0].paragraphs[0], "TABLE NO.", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[1].paragraphs[0], "TABLE CAPTION / TITLE", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[2].paragraphs[0], "PAGE", bold=True, size=9.5)
    h_row.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

    for idx, (num, title, page) in enumerate(tables):
        row = tbl_table.rows[idx+1]
        helpers['format_para'](row.cells[0].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['format_para'](row.cells[1].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['format_para'](row.cells[2].paragraphs[0], space_before=1.5, space_after=1.5, line_spacing=1.0)
        helpers['add_run'](row.cells[0].paragraphs[0], num, bold=True, size=9)
        helpers['add_run'](row.cells[1].paragraphs[0], title, size=9)
        p3 = row.cells[2].paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        helpers['add_run'](p3, page, size=9)

    helpers['style_table_borders'](tbl_table)

    doc.add_page_break()

    # =========================================================================
    # PAGE xi: LIST OF ACRONYMS (Calibrated to fit cleanly on Page xi)
    # =========================================================================
    helpers['add_chapter_heading'](doc, "LIST OF ACRONYMS")

    acronyms = [
        ("AI", "Artificial Intelligence"),
        ("API", "Application Programming Interface"),
        ("AST", "Abstract Syntax Tree"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("CPU", "Central Processing Unit"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSS", "Cascading Style Sheets"),
        ("DFD", "Data Flow Diagram"),
        ("ERD", "Entity-Relationship Diagram"),
        ("GenAI", "Generative Artificial Intelligence"),
        ("HTML", "HyperText Markup Language"),
        ("HTTP", "HyperText Transfer Protocol"),
        ("IDE", "Integrated Development Environment"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("LLM", "Large Language Model"),
        ("LOC", "Lines of Code"),
        ("MI", "Maintainability Index"),
        ("MVC", "Model-View-Controller"),
        ("NFR", "Non-Functional Requirement"),
        ("ODM", "Object-Document Mapping"),
        ("PO / PSO", "Program Outcome / Program Specific Outcome"),
        ("PR", "Pull Request"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SDK", "Software Development Kit"),
        ("SLO", "Service Level Objective"),
        ("SRU", "SR University"),
        ("TC", "Test Case"),
        ("UDIH", "Unified Developer Intelligence Hub"),
        ("UI / UX", "User Interface / User Experience"),
        ("UML", "Unified Modeling Language")
    ]

    acr_table = doc.add_table(rows=len(acronyms)+1, cols=2)
    acr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in acr_table.rows:
        r.cells[0].width = Inches(1.8)
        r.cells[1].width = Inches(4.6)

    h_row = acr_table.rows[0]
    helpers['add_run'](h_row.cells[0].paragraphs[0], "ACRONYM", bold=True, size=9.5)
    helpers['add_run'](h_row.cells[1].paragraphs[0], "EXPANSION / DEFINITION", bold=True, size=9.5)

    for idx, (acr, full) in enumerate(acronyms):
        row = acr_table.rows[idx+1]
        helpers['format_para'](row.cells[0].paragraphs[0], space_before=1.0, space_after=1.0, line_spacing=1.0)
        helpers['format_para'](row.cells[1].paragraphs[0], space_before=1.0, space_after=1.0, line_spacing=1.0)
        helpers['add_run'](row.cells[0].paragraphs[0], acr, bold=True, size=8.5)
        helpers['add_run'](row.cells[1].paragraphs[0], full, size=8.5)

    helpers['style_table_borders'](acr_table)

    # Transition to Section 3: Main Chapters (Arabic restart at 1)
    # (NO redundant page break before NEW_PAGE section break!)
    s3 = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    s3.top_margin = Inches(1.0)
    s3.bottom_margin = Inches(1.0)
    s3.left_margin = Inches(1.5)
    s3.right_margin = Inches(1.0)
    s3.header.is_linked_to_previous = False
    s3.footer.is_linked_to_previous = False
    p_foot3 = s3.footer.paragraphs[0]
    p_foot3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_foot3._p.append(parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>'))
    s3._sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>'))

    print("Preliminary pages completed successfully without redundant breaks.")
