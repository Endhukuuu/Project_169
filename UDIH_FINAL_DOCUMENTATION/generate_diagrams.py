import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r'D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION'
os.makedirs(out_dir, exist_ok=True)

# -------------------------------------------------------------
# 2. Use Case Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 8), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8)
ax.axis('off')
ax.text(5.5, 7.6, 'UDIH System Use Case Diagram', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

# System Boundary
sys_box = patches.FancyBboxPatch((3.0, 0.4), 5.0, 6.9, boxstyle='round,pad=0.2', ec='#1e293b', fc='#f8fafc', lw=1.5)
ax.add_patch(sys_box)
ax.text(5.5, 7.1, 'Unified Developer Intelligence Hub Boundary', fontsize=10, fontweight='bold', ha='center', fontfamily='serif')

# Actors: Developer (Left) & Admin (Right)
# Developer Actor
ax.scatter([1.5], [4.5], s=400, color='#1e3a8a')
ax.plot([1.5, 1.5], [4.2, 3.2], color='#1e3a8a', lw=2)
ax.plot([1.0, 2.0], [3.9, 3.9], color='#1e3a8a', lw=2)
ax.plot([1.5, 1.0], [3.2, 2.4], color='#1e3a8a', lw=2)
ax.plot([1.5, 2.0], [3.2, 2.4], color='#1e3a8a', lw=2)
ax.text(1.5, 2.0, 'Developer\n(Standard User)', fontsize=10, fontweight='bold', ha='center', fontfamily='serif')

# Admin Actor
ax.scatter([9.5], [4.5], s=400, color='#b45309')
ax.plot([9.5, 9.5], [4.2, 3.2], color='#b45309', lw=2)
ax.plot([9.0, 10.0], [3.9, 3.9], color='#b45309', lw=2)
ax.plot([9.5, 9.0], [3.2, 2.4], color='#b45309', lw=2)
ax.plot([9.5, 10.0], [3.2, 2.4], color='#b45309', lw=2)
ax.text(9.5, 2.0, 'System\nAdministrator', fontsize=10, fontweight='bold', ha='center', fontfamily='serif')

use_cases = [
    ('Register / Authenticate Session', 6.4, ['dev', 'admin']),
    ('Upload & Extract ZIP Repository', 5.5, ['dev', 'admin']),
    ('Execute 5-Stage Architecture Analysis', 4.6, ['dev', 'admin']),
    ('Run Single Snippet Code Analysis', 3.7, ['dev', 'admin']),
    ('Conduct AI Peer Review & Comments', 2.8, ['dev', 'admin']),
    ('View Quality Analytics & Telemetry', 1.9, ['dev', 'admin']),
    ('Audit All Users & Live Presence', 1.0, ['admin'])
]

for title, y, roles in use_cases:
    ellipse = patches.Ellipse((5.5, y), 3.8, 0.65, ec='#2563eb', fc='#ffffff', lw=1.2)
    ax.add_patch(ellipse)
    ax.text(5.5, y, title, fontsize=8.5, ha='center', va='center', fontfamily='serif')
    if 'dev' in roles:
        ax.plot([2.1, 3.6], [3.8, y], color='#64748b', lw=1, ls='--')
    if 'admin' in roles:
        ax.plot([8.9, 7.4], [3.8, y], color='#64748b', lw=1, ls='--')

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_use_case_diagram.png'), dpi=300)
plt.close()
print('Generated fig_use_case_diagram.png')

# -------------------------------------------------------------
# 3. Sequence Diagram (ZIP Project Intelligence Execution)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 8), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8)
ax.axis('off')
ax.text(5.5, 7.6, 'UDIH Project Intelligence Sequence Diagram', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

lifelines = [
    ('Client SPA\n(React UI)', 1.2),
    ('Express API\nGateway', 3.5),
    ('Preprocessor\nEngine', 5.8),
    ('Gemini AI\nResilience Engine', 8.0),
    ('MongoDB\nAtlas Cluster', 10.0)
]

for label, x in lifelines:
    r = patches.FancyBboxPatch((x-0.8, 6.7), 1.6, 0.6, boxstyle='square,pad=0.05', ec='#1e293b', fc='#e2e8f0', lw=1)
    ax.add_patch(r)
    ax.text(x, 7.0, label, fontsize=8, fontweight='bold', ha='center', va='center', fontfamily='serif')
    ax.plot([x, x], [6.7, 0.5], color='#94a3b8', lw=1, ls=':')

calls = [
    (6.2, 1.2, 3.5, '1: POST /upload (ZIP Archive)'),
    (5.7, 3.5, 5.8, '2: Extract & Scan Static Heuristics'),
    (5.2, 5.8, 3.5, '3: Return Manifest & AST Metrics'),
    (4.7, 3.5, 1.2, '4: Manifest Delivery & Progress UI'),
    (4.2, 1.2, 3.5, '5: POST /analyze (Manifest & Files)'),
    (3.7, 3.5, 8.0, '6: Stage 2: Architecture Synthesis'),
    (3.2, 8.0, 3.5, '7: Return Architecture Envelope JSON'),
    (2.7, 3.5, 8.0, '8: Stage 3 & 4: Batches & Cross-File Synthesis'),
    (2.2, 8.0, 3.5, '9: Return Synthesis & Quality Score'),
    (1.7, 3.5, 10.0, '10: Persist ProjectAnalysis, Files & Issues'),
    (1.2, 10.0, 3.5, '11: DB Insert Confirmation (ObjectId)'),
    (0.7, 3.5, 1.2, '12: Return Full Intelligence Report (200 OK)')
]

for y, x1, x2, msg in calls:
    is_return = x1 > x2
    ax.annotate('', xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle='->', lw=1.2, color='#0284c7' if not is_return else '#059669', ls='-' if not is_return else '--'))
    mid_x = (x1 + x2) / 2
    ax.text(mid_x, y + 0.12, msg, fontsize=7.5, ha='center', fontfamily='serif')

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_sequence_diagram.png'), dpi=300)
plt.close()
print('Generated fig_sequence_diagram.png')

# -------------------------------------------------------------
# 4. Activity Diagram (End-to-End Processing Flowchart)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9, 9), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')
ax.text(5.0, 9.6, 'UDIH Project Intelligence Activity Flow', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

# Start State
start = patches.Circle((5.0, 9.1), 0.2, color='#0f172a')
ax.add_patch(start)

nodes = [
    (8.3, 'ZIP Ingestion & Upload', '#e0f2fe', '#0284c7'),
    (7.4, 'AdmZip Extraction & Temporary Staging', '#e0f2fe', '#0284c7'),
    (6.5, 'File Filtering (Suppression of Binaries & .env Secrets)', '#fef3c7', '#d97706'),
    (5.6, 'Local AST Preprocessing (Imports/Exports & Heuristics)', '#dcfce7', '#16a34a'),
    (4.7, 'Stage 2 Architecture Pattern Analysis (Gemini Flash)', '#f3e8ff', '#9333ea'),
    (3.8, 'Stage 3 Boundary-Aware Batch Execution (Concurrency Pool)', '#f3e8ff', '#9333ea'),
    (2.9, 'Stage 4 Cross-File Synthesis & Quality Scoring', '#f3e8ff', '#9333ea'),
    (2.0, 'Stage 5 MongoDB Batch Persistence & Telemetry Logging', '#fee2e2', '#dc2626'),
    (1.1, 'Interactive File Tree & Architecture Report Visualization', '#e0f2fe', '#0284c7')
]

prev_y = 9.1
for y, text, fc, ec in nodes:
    ax.annotate('', xy=(5.0, y + 0.35), xytext=(5.0, prev_y - (0.2 if prev_y == 9.1 else 0.35)), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
    rect = patches.FancyBboxPatch((2.2, y - 0.35), 5.6, 0.7, boxstyle='round,pad=0.15', ec=ec, fc=fc, lw=1.3)
    ax.add_patch(rect)
    ax.text(5.0, y, text, fontsize=8.5, ha='center', va='center', fontweight='bold', fontfamily='serif')
    prev_y = y

# Final State
end_outer = patches.Circle((5.0, 0.3), 0.22, ec='#0f172a', fc='none', lw=1.5)
end_inner = patches.Circle((5.0, 0.3), 0.15, color='#0f172a')
ax.annotate('', xy=(5.0, 0.52), xytext=(5.0, 0.75), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
ax.add_patch(end_outer)
ax.add_patch(end_inner)

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_activity_diagram.png'), dpi=300)
plt.close()
print('Generated fig_activity_diagram.png')

# -------------------------------------------------------------
# 5. Data Flow Diagram (DFD Level 1)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 8), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8)
ax.axis('off')
ax.text(5.5, 7.6, 'UDIH Data Flow Diagram (DFD Level 1)', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

# External Entities
ext_dev = patches.Rectangle((0.5, 5.0), 1.8, 1.2, ec='#1e3a8a', fc='#dbeafe', lw=1.5)
ax.add_patch(ext_dev)
ax.text(1.4, 5.6, 'Developer\nEntity', fontsize=9, fontweight='bold', ha='center', va='center', fontfamily='serif')

ext_admin = patches.Rectangle((0.5, 1.5), 1.8, 1.2, ec='#b45309', fc='#fef3c7', lw=1.5)
ax.add_patch(ext_admin)
ax.text(1.4, 2.1, 'Admin\nEntity', fontsize=9, fontweight='bold', ha='center', va='center', fontfamily='serif')

ext_gemini = patches.Rectangle((8.7, 4.5), 1.8, 1.5, ec='#4338ca', fc='#e0e7ff', lw=1.5)
ax.add_patch(ext_gemini)
ax.text(9.6, 5.25, 'Google Gemini\nAI Platform\n(External API)', fontsize=8.5, fontweight='bold', ha='center', va='center', fontfamily='serif')

# Processes (Circles)
processes = [
    (4.0, 6.2, '1.0\nAuthentication\n& Session Ping'),
    (4.0, 4.4, '2.0\nProject ZIP\nIngestion & Preproc'),
    (6.5, 5.2, '3.0\nMulti-Stage AI\nArchitecture Synth'),
    (4.0, 2.6, '4.0\nSingle Code\nAnalysis & Review'),
    (6.5, 2.0, '5.0\nAdmin Oversight\n& Audit Telemetry')
]

for x, y, title in processes:
    p = patches.Circle((x, y), 0.75, ec='#047857', fc='#ecfdf5', lw=1.4)
    ax.add_patch(p)
    ax.text(x, y, title, fontsize=7.5, ha='center', va='center', fontweight='bold', fontfamily='serif')

# Data Stores (Open-ended parallel lines)
stores = [
    (4.0, 0.7, 'D1: Users Collection'),
    (6.5, 0.7, 'D2: Projects & Analyses'),
    (9.0, 0.7, 'D3: Activity Logs & Issues')
]

for x, y, title in stores:
    ax.plot([x - 1.0, x + 1.0], [y + 0.25, y + 0.25], color='#0f172a', lw=1.5)
    ax.plot([x - 1.0, x + 1.0], [y - 0.25, y - 0.25], color='#0f172a', lw=1.5)
    ax.text(x, y, title, fontsize=8, ha='center', va='center', fontweight='bold', fontfamily='serif')

# Data Flow Connectors
ax.annotate('', xy=(3.25, 6.2), xytext=(2.3, 5.8), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
ax.text(2.6, 6.15, 'Credentials', fontsize=7, fontfamily='serif')

ax.annotate('', xy=(3.25, 4.6), xytext=(2.3, 5.4), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
ax.text(2.7, 5.1, 'ZIP Repository', fontsize=7, fontfamily='serif')

ax.annotate('', xy=(5.75, 5.2), xytext=(4.75, 4.6), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
ax.text(5.1, 5.1, 'Manifest & AST', fontsize=7, fontfamily='serif')

ax.annotate('', xy=(8.7, 5.4), xytext=(7.25, 5.4), arrowprops=dict(arrowstyle='<->', lw=1.2, color='#4338ca'))
ax.text(7.9, 5.6, 'Prompts / JSON', fontsize=7, color='#4338ca', fontfamily='serif')

ax.annotate('', xy=(4.0, 1.2), xytext=(4.0, 1.85), arrowprops=dict(arrowstyle='<->', lw=1.2, color='#334155'))
ax.annotate('', xy=(6.5, 1.2), xytext=(6.5, 4.45), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))
ax.annotate('', xy=(8.5, 1.2), xytext=(7.25, 2.0), arrowprops=dict(arrowstyle='->', lw=1.2, color='#334155'))

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_dfd_level1.png'), dpi=300)
plt.close()
print('Generated fig_dfd_level1.png')

# -------------------------------------------------------------
# 6. Entity-Relationship Diagram (ERD)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8.5)
ax.axis('off')
ax.text(5.5, 8.1, 'UDIH MongoDB Database Entity-Relationship Diagram', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

entities = [
    (1.0, 5.5, 'User', ['_id: ObjectId (PK)', 'name: String', 'email: String (UK)', 'password: Hash', 'role: Enum', 'status: Enum', 'lastActive: Date']),
    (5.0, 5.5, 'Project', ['_id: ObjectId (PK)', 'owner: ObjectId (FK)', 'name: String', 'description: String', 'languages: [String]', 'fileCount: Number', 'lastAnalyzedAt: Date']),
    (9.0, 5.5, 'ProjectAnalysis', ['_id: ObjectId (PK)', 'project: ObjectId (FK)', 'user: ObjectId (FK)', 'summary: String', 'architecture: Object', 'qualityScore: Number', 'dataFlow: String']),
    (1.0, 1.8, 'SingleAnalysis', ['_id: ObjectId (PK)', 'user: ObjectId (FK)', 'project: ObjectId (FK)', 'codeSnippet: String', 'language: String', 'qualityScore: Number', 'complexity: Object']),
    (5.0, 1.8, 'CodeReview', ['_id: ObjectId (PK)', 'user: ObjectId (FK)', 'project: ObjectId (FK)', 'title: String', 'score: Number', 'status: Enum', 'comments: [Array]']),
    (9.0, 1.8, 'ProjectIssue & File', ['_id: ObjectId (PK)', 'project: ObjectId (FK)', 'analysis: ObjectId (FK)', 'title: String', 'severity: Enum', 'filePath: String', 'imports: [Array]'])
]

for x, y, title, attrs in entities:
    r_hdr = patches.Rectangle((x - 0.9, y + 0.8), 2.1, 0.4, ec='#0f172a', fc='#1e293b', lw=1)
    ax.add_patch(r_hdr)
    ax.text(x + 0.15, y + 1.0, title, color='#ffffff', fontsize=8.5, fontweight='bold', ha='center', va='center', fontfamily='serif')
    
    r_body = patches.Rectangle((x - 0.9, y - 0.9), 2.1, 1.7, ec='#0f172a', fc='#f8fafc', lw=1)
    ax.add_patch(r_body)
    for i, attr in enumerate(attrs):
        ax.text(x - 0.8, y + 0.6 - (i * 0.22), attr, fontsize=6.8, fontfamily='serif')

# Relationships Lines
ax.plot([2.2, 4.1], [6.2, 6.2], color='#0f172a', lw=1.5)
ax.text(3.15, 6.35, '1 : N (owns)', fontsize=7.5, fontweight='bold', ha='center', fontfamily='serif')

ax.plot([6.2, 8.1], [6.2, 6.2], color='#0f172a', lw=1.5)
ax.text(7.15, 6.35, '1 : N (analyzed)', fontsize=7.5, fontweight='bold', ha='center', fontfamily='serif')

ax.plot([5.15, 5.15], [5.5, 3.5], color='#0f172a', lw=1.5)
ax.text(5.5, 4.5, '1 : N', fontsize=7.5, fontweight='bold', ha='center', fontfamily='serif')

ax.plot([1.15, 1.15], [5.5, 3.5], color='#0f172a', lw=1.5)
ax.text(1.5, 4.5, '1 : N', fontsize=7.5, fontweight='bold', ha='center', fontfamily='serif')

ax.plot([9.15, 9.15], [5.5, 3.5], color='#0f172a', lw=1.5)
ax.text(9.5, 4.5, '1 : N', fontsize=7.5, fontweight='bold', ha='center', fontfamily='serif')

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_er_diagram.png'), dpi=300)
plt.close()
print('Generated fig_er_diagram.png')

# -------------------------------------------------------------
# 7. Five-Stage Project Intelligence Pipeline Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 7)
ax.axis('off')
ax.text(5.5, 6.6, 'UDIH 5-Stage Multi-File Project Intelligence Pipeline', fontsize=14, fontweight='bold', ha='center', fontfamily='serif')

stages = [
    (1.1, 'Stage 1\nDeterministic\nPreprocessing', 'Local AST Parsers\nImports / Exports\nStatic Heuristics\nCode Line Metrics', '#dcfce7', '#16a34a'),
    (3.3, 'Stage 2\nArchitecture\nSynthesis', 'Ingest Manifest\nHigh-Level Pattern\nFrontend / Backend\nDatabase Stack', '#e0e7ff', '#4338ca'),
    (5.5, 'Stage 3\nToken-Budgeted\nBatch Analysis', 'Token Estimator\nBoundary Splitting\n3500 Tokens/Batch\nWorker Pool (N=2)', '#fef3c7', '#d97706'),
    (7.7, 'Stage 4\nCross-File\nSynthesis', 'Inter-Module Flow\nShared Interfaces\nSeverity Scoring\nDefect Deduction', '#f3e8ff', '#9333ea'),
    (9.9, 'Stage 5\nConsolidation &\nPersistence', 'ProjectAnalysis Doc\nProjectFile Batch\nProjectIssue Batch\nAudit Log & Alert', '#fee2e2', '#dc2626')
]

for x, title, desc, fc, ec in stages:
    r_top = patches.FancyBboxPatch((x - 0.9, 4.5), 1.8, 1.4, boxstyle='round,pad=0.1', ec=ec, fc=fc, lw=1.4)
    ax.add_patch(r_top)
    ax.text(x, 5.2, title, fontsize=8.5, fontweight='bold', ha='center', va='center', fontfamily='serif')

    r_bot = patches.FancyBboxPatch((x - 0.9, 1.8), 1.8, 2.2, boxstyle='round,pad=0.1', ec='#94a3b8', fc='#ffffff', lw=1)
    ax.add_patch(r_bot)
    ax.text(x, 2.9, desc, fontsize=8, ha='center', va='center', fontfamily='serif')
    
    ax.annotate('', xy=(x, 4.0), xytext=(x, 4.5), arrowprops=dict(arrowstyle='->', lw=1.2, color=ec))

# Horizontal Pipeline Connectors
for i in range(4):
    x1 = stages[i][0] + 0.9
    x2 = stages[i+1][0] - 0.9
    ax.annotate('', xy=(x2, 5.2), xytext=(x1, 5.2), arrowprops=dict(arrowstyle='->', lw=1.5, color='#1e293b'))

plt.tight_layout()
plt.savefig(os.path.join(out_dir, 'fig_pipeline_stages.png'), dpi=300)
plt.close()
print('Generated fig_pipeline_stages.png')
print('ALL 7 DIAGRAMS GENERATED SUCCESSFULLY!')
