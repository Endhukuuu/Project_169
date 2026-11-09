import win32com.client
import os

report_path = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION\2303A51105-Harsh_UDIH_Final_Report.docx"

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
doc = word.Documents.Open(report_path)

print(f"Total sections: {doc.Sections.Count}")

# Let's inspect paragraphs and find exact page numbers
headings_to_find = [
    # Prelims
    "DECLARATION",
    "ACKNOWLEDGEMENTS",
    "ABSTRACT",
    "TABLE OF CONTENTS",
    "LIST OF FIGURES",
    "LIST OF TABLES",
    "LIST OF ACRONYMS",
    # Chapters
    "CHAPTER 1",
    "1.1 BACKGROUND AND PROBLEM CONTEXT",
    "1.2 EVOLUTION OF SOFTWARE ENGINEERING",
    "1.3 OVERVIEW OF THE UNIFIED DEVELOPER",
    "1.4 OBJECTIVES OF THE PROJECT",
    "1.5 SCOPE AND OPERATIONAL BOUNDARIES",
    "1.6 REPORT ORGANIZATION",
    "CHAPTER 2",
    "2.1 CLASSICAL STATIC CODE ANALYSIS",
    "2.2 DEEP LEARNING AND TRANSFORMERS",
    "2.3 LARGE LANGUAGE MODELS FOR AUTOMATED",
    "2.4 MULTI-TENANT DEVELOPER PLATFORMS",
    "2.5 CRITICAL COMPARATIVE ANALYSIS",
    "2.6 IDENTIFICATION OF RESEARCH AND ENGINEERING",
    "CHAPTER 3",
    "3.1 PROBLEM DEFINITION IN MODERN ENTERPRISE",
    "3.2 CONTEXT WINDOW SATURATION AND INFORMATION",
    "3.3 NEED FOR A HYBRID STATIC-HEURISTIC",
    "3.4 CORE ENGINEERING GOALS AND SUCCESS",
    "3.5 EXPECTED ENGINEERING AND SOCIETAL",
    "CHAPTER 4",
    "4.1 STAKEHOLDER PROFILES AND PERSONA",
    "4.2 FUNCTIONAL REQUIREMENTS SPECIFICATION",
    "4.3 NON-FUNCTIONAL REQUIREMENTS SPECIFICATION",
    "4.4 COMPREHENSIVE FEASIBILITY ANALYSIS",
    "4.5 RISK ASSESSMENT, HAZARD ANALYSIS",
    "4.6 DEVELOPMENT METHODOLOGY AND ITERATIVE",
    "CHAPTER 5",
    "5.1 HIGH-LEVEL ARCHITECTURAL PARADIGM",
    "5.2 TIERED LAYER DECOMPOSITION AND SERVICE",
    "5.3 DECOUPLED SERVICE ARCHITECTURE",
    "5.4 DUAL-MODEL AI RESILIENCE FRAMEWORK",
    "5.5 DUAL-MODE PERSISTENCE ARCHITECTURE",
    "5.6 STRUCTURED PROMPT TRUNCATION",
    "5.7 SECURITY ARCHITECTURE: JWT AUTH",
    "CHAPTER 6",
    "6.1 USE CASE MODELING AND ACTOR INTERACTION",
    "6.2 DYNAMIC BEHAVIORAL MODELING: SEQUENCE",
    "6.3 WORKFLOW MODELING: ACTIVITY DIAGRAMS",
    "6.4 DATA FLOW MODELING",
    "6.5 INFORMATION MODELING: ENTITY-RELATIONSHIP",
    "6.6 MULTI-STAGE PIPELINE EXECUTION LIFECYCLE",
    "CHAPTER 7",
    "7.1 TECHNOLOGY STACK AND IMPLEMENTATION",
    "7.2 INGESTION ENGINE: EPHEMERAL DIRECTORY",
    "7.3 STATIC CODE ANALYZER ENGINE: HEURISTICS",
    "7.4 AI INTELLIGENCE AND REVIEW MODULE",
    "7.5 AUTHENTICATION, SESSION SECURITY",
    "7.6 DASHBOARD ANALYTICS ENGINE",
    "7.7 ADMINISTRATION PORTAL",
    "CHAPTER 8",
    "8.1 VERIFICATION AND VALIDATION FRAMEWORK",
    "8.2 FORMAL TEST SUITE EXECUTION",
    "8.3 SECURITY AUDIT: INJECTION, TRAVERSAL",
    "8.4 PERFORMANCE PROFILING, LATENCY",
    "8.5 VERIFIED TEST EXECUTION TRANSCRIPTS",
    "CHAPTER 9",
    "9.1 STATIC ANALYSIS ACCURACY VS. AI",
    "9.2 TOKEN EFFICIENCY AND COST OPTIMIZATION",
    "9.3 HEALTH SCORE CALIBRATION AND DETERMINISTIC",
    "9.4 ENTERPRISE ANALYTICS AND HISTORICAL",
    "9.5 DISCUSSION OF FINDINGS AND INDUSTRIAL",
    "CHAPTER 10",
    "10.1 TECHNICAL COMPETENCIES AND DOMAIN",
    "10.2 SOFTWARE ENGINEERING BEST PRACTICES",
    "10.3 COMPREHENSIVE INDIVIDUAL TEAM MEMBER",
    "10.4 MAPPING TO PROGRAM OUTCOMES",
    "CHAPTER 11",
    "11.1 PROJECT SUMMARY AND VALUE DELIVERED",
    "11.2 CURRENT SYSTEM LIMITATIONS AND EDGE",
    "11.3 FUTURE ENGINEERING AND RESEARCH ROADMAP",
    "11.4 CONCLUDING REMARKS",
    "REFERENCES",
    "APPENDIX A",
    "APPENDIX B",
    "APPENDIX C"
]

print("\n--- EXTRACTING ACTUAL PRINTED PAGE NUMBERS ---")
found_pages = {}

for i in range(1, doc.Paragraphs.Count + 1):
    p = doc.Paragraphs(i)
    txt = p.Range.Text.strip().replace('\r', ' ').replace('\n', ' ')
    if not txt:
        continue
    
    # Check if matches any heading
    for h in headings_to_find:
        if h not in found_pages and h in txt:
            # Get printed page number
            # wdActiveEndPageNumber = 3
            # wdActiveEndSectionNumber = 4
            overall_page = p.Range.Information(3)
            section_num = p.Range.Information(4)
            
            # If section 2, roman numeral
            # If section 3, serial page number starting at 1!
            if section_num == 3:
                # In section 3, page numbering restarts at 1!
                # What is the serial page number in section 3?
                # Section 1 has 2 pages (Title, Cert)
                # Section 2 has prelim pages (iii to x = 8 pages)
                # Total prelim pages = 10 pages!
                # So in section 3: serial page = overall_page - 10!
                serial_page = overall_page - 10
                found_pages[h] = str(serial_page)
                print(f"{h:<40} -> Section {section_num}, Page {serial_page} (Overall {overall_page})")
            elif section_num == 2:
                # Roman page: overall 3 is iii, overall 4 is iv, etc.
                romans = {3: "iii", 4: "iv", 5: "v", 6: "vi", 7: "vii", 8: "viii", 9: "ix", 10: "x", 11: "xi"}
                found_pages[h] = romans.get(overall_page, str(overall_page))
                print(f"{h:<40} -> Section {section_num}, Page {found_pages[h]} (Overall {overall_page})")

# Also find Figures and Tables
print("\n--- EXTRACTING FIGURES & TABLES PAGE NUMBERS ---")
fig_tbl_items = [
    "Figure 5.1", "Figure 5.2", "Figure 6.1", "Figure 6.2", "Figure 6.3",
    "Figure 6.4", "Figure 6.5", "Figure 7.1", "Figure 7.2", "Figure 7.3",
    "Figure 7.4", "Figure 7.5", "Figure 9.1", "Figure 9.2", "Figure 9.3",
    "Table 2.1", "Table 4.1", "Table 4.2", "Table 4.3", "Table 7.1",
    "Table 7.2", "Table 8.1", "Table 8.2", "Table 8.3", "Table 9.1",
    "Table 9.2", "Table 10.1", "Table 10.2", "Table A.1"
]

for i in range(1, doc.Paragraphs.Count + 1):
    p = doc.Paragraphs(i)
    txt = p.Range.Text.strip()
    for ft in fig_tbl_items:
        if ft not in found_pages and ft in txt:
            overall_page = p.Range.Information(3)
            serial_page = overall_page - 10
            found_pages[ft] = str(serial_page)
            print(f"{ft:<20} -> Page {serial_page} (Overall {overall_page})")

doc.Close(False)
word.Quit()

# Output dictionary for easy updating
import pprint
print("\n--- ALL EXTRACTED PAGE NUMBERS ---")
pprint.pprint(found_pages)
