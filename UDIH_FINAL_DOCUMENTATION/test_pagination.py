import docx
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document()
# Section 1: Title & Cert (no number)
s1 = doc.sections[0]
doc.add_paragraph('Title Page')
doc.add_page_break()
doc.add_paragraph('Certificate')

# Section 2: Prelims (roman starting at iii)
s2 = doc.add_section(WD_SECTION.NEW_PAGE)
s2.header.is_linked_to_previous = False
s2.footer.is_linked_to_previous = False
p_foot2 = s2.footer.paragraphs[0]
p_foot2.alignment = WD_ALIGN_PARAGRAPH.CENTER
fld2 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
p_foot2._p.append(fld2)
pgNumType2 = parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman" w:start="3"/>')
s2._sectPr.append(pgNumType2)

doc.add_paragraph('Declaration')
doc.add_page_break()
doc.add_paragraph('Acknowledgements')

# Section 3: Chapters (arabic restart at 1)
s3 = doc.add_section(WD_SECTION.NEW_PAGE)
s3.header.is_linked_to_previous = False
s3.footer.is_linked_to_previous = False
p_foot3 = s3.footer.paragraphs[0]
p_foot3.alignment = WD_ALIGN_PARAGRAPH.CENTER
fld3 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
p_foot3._p.append(fld3)
pgNumType3 = parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>')
s3._sectPr.append(pgNumType3)

doc.add_paragraph('Chapter 1: Introduction')

test_path = r'D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION\test_pagination.docx'
doc.save(test_path)
print('Saved test pagination docx successfully!')
