import win32com.client
import json

report_path = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION\2303A51105-Harsh_UDIH_Final_Report.docx"

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
doc = word.Documents.Open(report_path)

# 1. Section 2: Prelims (Pages iii to x)
print("--- PRELIMINARY PAGES (SECTION 2) ---")
# Title Page -> i
# Certificate -> ii
# Declaration -> iii
# Acknowledgements -> iv
# Abstract -> v
# Table of Contents -> vi
# List of Figures -> viii
# List of Tables -> ix
# List of Acronyms -> x

# 2. Section 3: Chapters 1 to 11, References, Appendices
s3 = doc.Sections(3)
p_count = s3.Range.Paragraphs.Count
print(f"Total Paragraphs in Section 3: {p_count}")

toc_targets = [
    ("CHAPTER 1", "CHAPTER 1"),
    ("1.1", "1.1 BACKGROUND AND PROBLEM CONTEXT"),
    ("1.2", "1.2 EVOLUTION OF SOFTWARE ENGINEERING"),
    ("1.3", "1.3 OVERVIEW OF THE UNIFIED DEVELOPER"),
    ("1.4", "1.4 OBJECTIVES OF THE PROJECT"),
    ("1.5", "1.5 SCOPE AND OPERATIONAL BOUNDARIES"),
    ("1.6", "1.6 REPORT ORGANIZATION"),
    ("CHAPTER 2", "CHAPTER 2"),
    ("2.1", "2.1 CLASSICAL STATIC CODE ANALYSIS"),
    ("2.2", "2.2 DEEP LEARNING AND TRANSFORMERS"),
    ("2.3", "2.3 LARGE LANGUAGE MODELS FOR AUTOMATED"),
    ("2.4", "2.4 MULTI-TENANT DEVELOPER PLATFORMS"),
    ("2.5", "2.5 CRITICAL COMPARATIVE ANALYSIS"),
    ("2.6", "2.6 IDENTIFICATION OF RESEARCH AND ENGINEERING"),
    ("CHAPTER 3", "CHAPTER 3"),
    ("3.1", "3.1 PROBLEM DEFINITION IN MODERN ENTERPRISE"),
    ("3.2", "3.2 CONTEXT WINDOW SATURATION AND INFORMATION"),
    ("3.3", "3.3 NEED FOR A HYBRID STATIC-HEURISTIC"),
    ("3.4", "3.4 CORE ENGINEERING GOALS AND SUCCESS"),
    ("3.5", "3.5 EXPECTED ENGINEERING AND SOCIETAL"),
    ("CHAPTER 4", "CHAPTER 4"),
    ("4.1", "4.1 STAKEHOLDER PROFILES AND PERSONA"),
    ("4.2", "4.2 FUNCTIONAL REQUIREMENTS SPECIFICATION"),
    ("4.3", "4.3 NON-FUNCTIONAL REQUIREMENTS SPECIFICATION"),
    ("4.4", "4.4 COMPREHENSIVE FEASIBILITY ANALYSIS"),
    ("4.5", "4.5 RISK ASSESSMENT, HAZARD ANALYSIS"),
    ("4.6", "4.6 DEVELOPMENT METHODOLOGY AND ITERATIVE"),
    ("CHAPTER 5", "CHAPTER 5"),
    ("5.1", "5.1 HIGH-LEVEL ARCHITECTURAL PARADIGM"),
    ("5.2", "5.2 TIERED LAYER DECOMPOSITION AND SERVICE"),
    ("5.3", "5.3 DECOUPLED SERVICE ARCHITECTURE"),
    ("5.4", "5.4 DUAL-MODEL AI RESILIENCE FRAMEWORK"),
    ("5.5", "5.5 DUAL-MODE PERSISTENCE ARCHITECTURE"),
    ("5.6", "5.6 STRUCTURED PROMPT TRUNCATION"),
    ("5.7", "5.7 SECURITY ARCHITECTURE: JWT AUTH"),
    ("CHAPTER 6", "CHAPTER 6"),
    ("6.1", "6.1 USE CASE MODELING AND ACTOR INTERACTION"),
    ("6.2", "6.2 DYNAMIC BEHAVIORAL MODELING: SEQUENCE"),
    ("6.3", "6.3 WORKFLOW MODELING: ACTIVITY DIAGRAMS"),
    ("6.4", "6.4 DATA FLOW MODELING"),
    ("6.5", "6.5 INFORMATION MODELING: ENTITY-RELATIONSHIP"),
    ("6.6", "6.6 MULTI-STAGE PIPELINE EXECUTION LIFECYCLE"),
    ("CHAPTER 7", "CHAPTER 7"),
    ("7.1", "7.1 TECHNOLOGY STACK AND IMPLEMENTATION"),
    ("7.2", "7.2 INGESTION ENGINE: EPHEMERAL DIRECTORY"),
    ("7.3", "7.3 STATIC CODE ANALYZER ENGINE: HEURISTICS"),
    ("7.4", "7.4 AI INTELLIGENCE AND REVIEW MODULE"),
    ("7.5", "7.5 AUTHENTICATION, SESSION SECURITY"),
    ("7.6", "7.6 DASHBOARD ANALYTICS ENGINE"),
    ("7.7", "7.7 ADMINISTRATION PORTAL"),
    ("CHAPTER 8", "CHAPTER 8"),
    ("8.1", "8.1 VERIFICATION AND VALIDATION FRAMEWORK"),
    ("8.2", "8.2 FORMAL TEST SUITE EXECUTION"),
    ("8.3", "8.3 SECURITY AUDIT: INJECTION, TRAVERSAL"),
    ("8.4", "8.4 PERFORMANCE PROFILING, LATENCY"),
    ("8.5", "8.5 VERIFIED TEST EXECUTION TRANSCRIPTS"),
    ("CHAPTER 9", "CHAPTER 9"),
    ("9.1", "9.1 STATIC ANALYSIS ACCURACY VS. AI"),
    ("9.2", "9.2 TOKEN EFFICIENCY AND COST OPTIMIZATION"),
    ("9.3", "9.3 HEALTH SCORE CALIBRATION AND DETERMINISTIC"),
    ("9.4", "9.4 ENTERPRISE ANALYTICS AND HISTORICAL"),
    ("9.5", "9.5 DISCUSSION OF FINDINGS AND INDUSTRIAL"),
    ("CHAPTER 10", "CHAPTER 10"),
    ("10.1", "10.1 TECHNICAL COMPETENCIES AND DOMAIN"),
    ("10.2", "10.2 SOFTWARE ENGINEERING BEST PRACTICES"),
    ("10.3", "10.3 COMPREHENSIVE INDIVIDUAL TEAM MEMBER"),
    ("10.4", "10.4 MAPPING TO PROGRAM OUTCOMES"),
    ("CHAPTER 11", "CHAPTER 11"),
    ("11.1", "11.1 PROJECT SUMMARY AND VALUE DELIVERED"),
    ("11.2", "11.2 CURRENT SYSTEM LIMITATIONS AND EDGE"),
    ("11.3", "11.3 FUTURE ENGINEERING AND RESEARCH ROADMAP"),
    ("11.4", "11.4 CONCLUDING REMARKS"),
    ("REFERENCES", "REFERENCES"),
    ("APPENDIX A", "APPENDIX A"),
    ("APPENDIX B", "APPENDIX B"),
    ("APPENDIX C", "APPENDIX C")
]

fig_targets = [
    "Figure 5.1", "Figure 5.2", "Figure 6.1", "Figure 6.2", "Figure 6.3",
    "Figure 6.4", "Figure 6.5", "Figure 7.1", "Figure 7.2", "Figure 7.3",
    "Figure 7.4", "Figure 7.5", "Figure 9.1", "Figure 9.2", "Figure 9.3"
]

tbl_targets = [
    "Table 2.1", "Table 4.1", "Table 4.2", "Table 4.3", "Table 7.1",
    "Table 7.2", "Table 8.1", "Table 8.2", "Table 8.3", "Table 9.1",
    "Table 9.2", "Table 10.1", "Table 10.2", "Table A.1"
]

toc_results = {}
fig_results = {}
tbl_results = {}

for i in range(1, p_count + 1):
    p = s3.Range.Paragraphs(i)
    txt = p.Range.Text.strip().replace('\r', ' ').replace('\n', ' ')
    if not txt:
        continue
    page = p.Range.Information(1) # wdActiveEndAdjustedPageNumber
    
    # Check TOC targets
    for key, search_str in toc_targets:
        if key not in toc_results and search_str in txt:
            toc_results[key] = page
            print(f"TOC: {key:<12} -> Page {page} (found: {txt[:45]})")
            
    # Check Figures
    for fig_id in fig_targets:
        if fig_id not in fig_results and fig_id in txt:
            fig_results[fig_id] = page
            print(f"FIG: {fig_id:<12} -> Page {page}")
            
    # Check Tables
    for tbl_id in tbl_targets:
        if tbl_id not in tbl_results and tbl_id in txt:
            tbl_results[tbl_id] = page
            print(f"TBL: {tbl_id:<12} -> Page {page}")

doc.Close(False)
word.Quit()

with open(r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION\exact_page_numbers.json", "w") as f:
    json.dump({
        "toc": toc_results,
        "figures": fig_results,
        "tables": tbl_results
    }, f, indent=2)

print("\nSaved exact page numbers to exact_page_numbers.json!")
