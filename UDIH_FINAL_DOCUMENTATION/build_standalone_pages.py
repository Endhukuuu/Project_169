import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import shutil
import os

out_dir = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION"
title_tpl = r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1793898368103_c21cc8dc.docx"
cert_tpl = r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1793898368101_468ff07c.docx"
logo_path = os.path.join(out_dir, "sru_logo.png")

# 1. GENERATE TITLE_PAGE.docx
print("Generating TITLE_PAGE.docx...")
doc_t = docx.Document()

# Page Margins: Top: 1.0", Bottom: 1.0", Left: 1.5", Right: 1.0"
section = doc_t.sections[0]
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin = Inches(1.5)
section.right_margin = Inches(1.0)
section.page_width = Inches(8.27)  # A4
section.page_height = Inches(11.69)

def format_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6, line_spacing=1.15):
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing

def add_run(p, text, bold=False, size=12, italic=False, font_name="Times New Roman"):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.name = font_name
    r.font.size = Pt(size)
    return r

# Title Page Content
p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=12)
add_run(p, "THE UNIFIED DEVELOPER INTELLIGENCE HUB COMBINING ENTERPRISE DATA ANALYTICS, SEMANTIC CODE UNDERSTANDING, AND AI-POWERED COLLABORATIVE CODE REVIEW", bold=True, size=14)

p = doc_t.add_paragraph()
format_para(p, space_before=6, space_after=2)
add_run(p, "A Capstone Project report submitted", italic=True, size=12)

p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=12)
add_run(p, "in partial fulfillment of requirement for the award of degree", italic=True, size=12)

p = doc_t.add_paragraph()
format_para(p, space_before=6, space_after=2)
add_run(p, "BACHELOR OF TECHNOLOGY", bold=True, size=13)

p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=2)
add_run(p, "in", italic=True, size=11)

p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=12)
add_run(p, "SCHOOL OF COMPUTER SCIENCE AND ARTIFICIAL INTELLIGENCE", bold=True, size=12)

p = doc_t.add_paragraph()
format_para(p, space_before=4, space_after=8)
add_run(p, "by", italic=True, size=11)

# Students Table
table = doc_t.add_table(rows=5, cols=2)
table.alignment = WD_ALIGN_PARAGRAPH.CENTER
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
    p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
    format_para(p0, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=1, space_after=1)
    add_run(p0, name, bold=True, size=11)
    
    p1 = r.cells[1].paragraphs[0]
    format_para(p1, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=1, space_after=1)
    add_run(p1, f"({roll})", bold=True, size=11)

p = doc_t.add_paragraph()
format_para(p, space_before=14, space_after=2)
add_run(p, "Under the guidance of", italic=True, size=11)

p = doc_t.add_paragraph()
format_para(p, space_before=2, space_after=2)
add_run(p, "[Guide Name / Faculty Mentor]", bold=True, size=12)

p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=12)
add_run(p, "Assistant / Associate Professor, School of CS&AI", size=11)

# Logo
p = doc_t.add_paragraph()
format_para(p, space_before=8, space_after=8)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run().add_picture(logo_path, width=Inches(1.5))

p = doc_t.add_paragraph()
format_para(p, space_before=4, space_after=2)
add_run(p, "SR UNIVERSITY", bold=True, size=13)

p = doc_t.add_paragraph()
format_para(p, space_before=0, space_after=0)
add_run(p, "Ananthasagar, Warangal, Telangana - 506371", size=11)

doc_t.save(os.path.join(out_dir, "TITLE_PAGE.docx"))
print("TITLE_PAGE.docx saved successfully.")


# 2. GENERATE CERTIFICATE.docx
print("Generating CERTIFICATE.docx...")
doc_c = docx.Document()
section = doc_c.sections[0]
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin = Inches(1.5)
section.right_margin = Inches(1.0)
section.page_width = Inches(8.27)
section.page_height = Inches(11.69)

p = doc_c.add_paragraph()
format_para(p, space_before=0, space_after=2)
add_run(p, "SR University", bold=True, size=16)

p = doc_c.add_paragraph()
format_para(p, space_before=0, space_after=6)
add_run(p, "Ananthasagar, Warangal - 506371", size=11)

p = doc_c.add_paragraph()
format_para(p, space_before=4, space_after=8)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run().add_picture(logo_path, width=Inches(1.4))

p = doc_c.add_paragraph()
format_para(p, space_before=8, space_after=14)
add_run(p, "CERTIFICATE", bold=True, size=16)

p = doc_c.add_paragraph()
format_para(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=14, line_spacing=1.5)
p.paragraph_format.first_line_indent = Inches(0.5)
add_run(p, 'This is to certify that this project entitled ', size=12)
add_run(p, '"THE UNIFIED DEVELOPER INTELLIGENCE HUB COMBINING ENTERPRISE DATA ANALYTICS, SEMANTIC CODE UNDERSTANDING, AND AI-POWERED COLLABORATIVE CODE REVIEW"', bold=True, size=12)
add_run(p, ' is the bonafide work carried out by ', size=12)
add_run(p, 'Harsh (2303A51105), Anand (2303A51090), Aneesh (2303A51120), Vishwanath (2303A51095), and Bharath (2303A51097)', bold=True, size=12)
add_run(p, ' as a Capstone Project for the partial fulfillment to award the degree ', size=12)
add_run(p, 'BACHELOR OF TECHNOLOGY', bold=True, size=12)
add_run(p, ' in ', size=12)
add_run(p, 'School of Computer Science and Artificial Intelligence', bold=True, size=12)
add_run(p, ' during the academic year 2026-2027 under our guidance and supervision.', size=12)

# Guide & HOD Signature Table
sig_table = doc_c.add_table(rows=1, cols=2)
sig_table.alignment = WD_ALIGN_PARAGRAPH.CENTER
for r in sig_table.rows:
    r.cells[0].width = Inches(2.8)
    r.cells[1].width = Inches(2.8)

p_left = sig_table.rows[0].cells[0].paragraphs[0]
format_para(p_left, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=30, space_after=2, line_spacing=1.15)
add_run(p_left, "[Guide Name / Faculty Mentor]\n", bold=True, size=11)
add_run(p_left, "Assistant / Associate Professor,\n", size=10)
add_run(p_left, "School of CS&AI,\n", size=10)
add_run(p_left, "SR University,\n", size=10)
add_run(p_left, "Ananthasagar, Warangal.", size=10)

p_right = sig_table.rows[0].cells[1].paragraphs[0]
format_para(p_right, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=30, space_after=2, line_spacing=1.15)
add_run(p_right, "Dr. CH. Sandeep\n", bold=True, size=11)
add_run(p_right, "Associate Professor & Head,\n", size=10)
add_run(p_right, "School of CS&AI,\n", size=10)
add_run(p_right, "SR University,\n", size=10)
add_run(p_right, "Ananthasagar, Warangal.", size=10)

# Reviewers Table
p = doc_c.add_paragraph()
format_para(p, space_before=20, space_after=6)

rev_table = doc_c.add_table(rows=1, cols=2)
rev_table.alignment = WD_ALIGN_PARAGRAPH.CENTER
for r in rev_table.rows:
    r.cells[0].width = Inches(2.8)
    r.cells[1].width = Inches(2.8)

p_rev1 = rev_table.rows[0].cells[0].paragraphs[0]
format_para(p_rev1, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=2, line_spacing=1.15)
add_run(p_rev1, "Reviewer - 1\n", bold=True, size=11)
add_run(p_rev1, "Name: ___________________________\n", size=10)
add_run(p_rev1, "Designation: ____________________\n", size=10)
add_run(p_rev1, "Signature: ______________________", size=10)

p_rev2 = rev_table.rows[0].cells[1].paragraphs[0]
format_para(p_rev2, align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=10, space_after=2, line_spacing=1.15)
add_run(p_rev2, "Reviewer - 2\n", bold=True, size=11)
add_run(p_rev2, "Name: ___________________________\n", size=10)
add_run(p_rev2, "Designation: ____________________\n", size=10)
add_run(p_rev2, "Signature: ______________________", size=10)

doc_c.save(os.path.join(out_dir, "CERTIFICATE.docx"))
print("CERTIFICATE.docx saved successfully.")
