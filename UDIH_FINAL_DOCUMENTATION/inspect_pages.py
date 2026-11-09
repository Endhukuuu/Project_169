import win32com.client
import os

report_path = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION\2303A51105-Harsh_UDIH_Final_Report.docx"

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
doc = word.Documents.Open(report_path)

total_pages = doc.ComputeStatistics(2)
print(f"Total Pages in Report: {total_pages}\n")

empty_count = 0
for page_num in range(1, total_pages + 1):
    try:
        rng = doc.GoTo(What=1, Which=1, Count=page_num)
        if page_num == total_pages:
            rng.End = doc.Content.End
        else:
            rng_next = doc.GoTo(What=1, Which=1, Count=page_num + 1)
            rng.End = rng_next.Start
        
        text = rng.Text.strip()
        words = len(text.split())
        chars = len(text)
        preview = text[:55].replace('\r', ' ').replace('\n', ' ')
        
        status = "OK"
        if chars == 0:
            status = "EMPTY PAGE!"
            empty_count += 1
        elif chars < 150:
            status = "SPILLED / LOW DENSITY"
        
        print(f"Page {page_num:2d}: chars={chars:4d}, words={words:3d} [{status:^20}] | {preview}")
    except Exception as e:
        print(f"Page {page_num}: error: {e}")

print(f"\nAudit Finished: {empty_count} completely empty pages detected out of {total_pages} total pages.")

doc.Close(False)
word.Quit()
