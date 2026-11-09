# build_complete_report.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import shutil
import os
import sys

# Import section generators
import report_sections_prelim
import report_sections_ch1_to_ch4
import report_sections_ch5_to_ch7
import report_sections_ch8_to_ch11

doc_dir = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION"
report_filename = "2303A51105-Harsh_UDIH_Final_Report.docx"
report_copy_name = "UDIH_Capstone_Project_Report.docx"
report_path = os.path.join(doc_dir, report_filename)
report_copy_path = os.path.join(doc_dir, report_copy_name)
pdf_path = os.path.join(doc_dir, "2303A51105-Harsh_UDIH_Final_Report.pdf")

print("Initializing document...")
doc = docx.Document()

# Page Margins: Top: 1.0", Bottom: 1.0", Left: 1.5", Right: 1.0"
section = doc.sections[0]
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin = Inches(1.5)
section.right_margin = Inches(1.0)
section.page_width = Inches(8.27)  # A4
section.page_height = Inches(11.69)

# Helpers
def format_para(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5):
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing

def add_run(p, text, bold=False, size=12, italic=False, font_name="Times New Roman", color=None):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.name = font_name
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = color
    return r

def add_para(doc, text):
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5)
    p.paragraph_format.first_line_indent = Inches(0.5)
    add_run(p, text, size=12)
    return p

def add_chapter_heading(doc, text):
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=18, line_spacing=1.15)
    add_run(p, text, bold=True, size=16)
    return p

def add_heading1(doc, text):
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=14, space_after=6, line_spacing=1.15)
    add_run(p, text, bold=True, size=14)
    return p

def add_heading2(doc, text):
    p = doc.add_paragraph()
    format_para(p, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4, line_spacing=1.15)
    add_run(p, text, bold=True, size=12)
    return p

def add_figure(doc, img_path, caption, width=5.5):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        format_para(p_img, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
        p_img.add_run().add_picture(img_path, width=Inches(width))
    
    p_cap = doc.add_paragraph()
    format_para(p_cap, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=10)
    add_run(p_cap, caption, bold=True, italic=True, size=10.5)

def style_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>\n'
        f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)
    # Header row formatting
    for cell in table.rows[0].cells:
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
        tcPr.append(shd)

helpers = {
    'format_para': format_para,
    'add_run': add_run,
    'add_para': add_para,
    'add_chapter_heading': add_chapter_heading,
    'add_heading1': add_heading1,
    'add_heading2': add_heading2,
    'add_figure': add_figure,
    'style_table_borders': style_table_borders
}

# 1. Build Prelims
print("Writing preliminary pages...")
report_sections_prelim.add_preliminary_pages(doc, doc_dir, helpers)

# 2. Build Chapters 1 to 4
print("Writing Chapters 1 to 4...")
report_sections_ch1_to_ch4.add_chapters_1_to_4(doc, helpers)

# 3. Build Chapters 5 to 7
print("Writing Chapters 5 to 7...")
report_sections_ch5_to_ch7.add_chapters_5_to_7(doc, doc_dir, helpers)

# 4. Build Chapters 8 to 11, References, Appendices
print("Writing Chapters 8 to 11, References, and Appendices...")
report_sections_ch8_to_ch11.add_chapters_8_to_11(doc, doc_dir, helpers)

# Save DOCX documents
print(f"Saving primary report to {report_path}...")
doc.save(report_path)
print(f"Saving duplicate report to {report_copy_path}...")
shutil.copyfile(report_path, report_copy_path)

print("Document assembly completed successfully!")

# Convert to PDF via Word COM Automation
print("Starting Microsoft Word COM Automation to compile native PDF...")
try:
    import win32com.client
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    word_doc = word.Documents.Open(report_path)
    
    # Update all fields / TOC
    try:
        word_doc.Fields.Update()
    except Exception as e:
        print(f"Note on field update: {e}")
        
    page_count = word_doc.ComputeStatistics(2)  # 2 = wdStatisticPages
    print(f"Total computed page count: {page_count} pages.")
    
    print(f"Exporting PDF to {pdf_path}...")
    word_doc.SaveAs(pdf_path, FileFormat=17)  # 17 = wdFormatPDF
    word_doc.Close(False)
    word.Quit()
    print("PDF compilation successful!")
    print(f"FINAL REPORT STATS: {page_count} pages compiled.")
except Exception as e:
    print(f"Error during Word COM PDF compilation: {e}")
    sys.exit(1)
