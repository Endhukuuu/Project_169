import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import os

out_dir = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION"
os.makedirs(out_dir, exist_ok=True)

# High-contrast professional palette
C_NAVY = '#0a0f1d'
C_SLATE_DARK = '#1e293b'
C_SLATE_MED = '#475569'
C_SLATE_LIGHT = '#f1f5f9'
C_WHITE = '#ffffff'

C_BLUE_DARK = '#1e40af'
C_BLUE_MED = '#2563eb'
C_BLUE_LIGHT = '#eff6ff'
C_BLUE_BORDER = '#3b82f6'

C_PURPLE_DARK = '#5b21b6'
C_PURPLE_MED = '#7c3aed'
C_PURPLE_LIGHT = '#f5f3ff'
C_PURPLE_BORDER = '#8b5cf6'

C_EMERALD_DARK = '#065f46'
C_EMERALD_MED = '#059669'
C_EMERALD_LIGHT = '#ecfdf5'
C_EMERALD_BORDER = '#10b981'

C_AMBER_DARK = '#92400e'
C_AMBER_MED = '#d97706'
C_AMBER_LIGHT = '#fffbeb'
C_AMBER_BORDER = '#f59e0b'

C_RED_DARK = '#991b1b'
C_RED_MED = '#dc2626'
C_RED_LIGHT = '#fef2f2'
C_RED_BORDER = '#ef4444'

def add_label_box(ax, x, y, text, color=C_NAVY, bg=C_WHITE, border=C_SLATE_MED, fontsize=9.5, fontweight='bold', pad=0.25):
    """Adds a text label with a clean opaque bounding box to prevent lines crossing through text."""
    ax.text(x, y, text, fontsize=fontsize, fontweight=fontweight, color=color, ha='center', va='center',
            bbox=dict(boxstyle=f"round,pad={pad}", facecolor=bg, edgecolor=border, linewidth=1.0, alpha=0.96))

# =============================================================================
# 1. FIG 5.1: HIGH-LEVEL TIERED SYSTEM ARCHITECTURE
# =============================================================================
def draw_system_architecture():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    # Main Diagram Header
    ax.text(3.8, 5.95, "Unified Developer Intelligence Hub (UDIH)", 
            fontsize=13, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 5.1: High-Level Tiered System Architecture", 
            fontsize=10.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    # 4 Tiers: y_bot, h, title, bg, border, banner_color
    tiers = [
        (4.25, 1.25, "TIER 1: PRESENTATION LAYER (React 19 + Tailwind CSS SPA)", C_BLUE_LIGHT, C_BLUE_BORDER, C_BLUE_MED),
        (2.85, 1.25, "TIER 2: API GATEWAY & APPLICATION ROUTING (Node.js + Express 5)", C_PURPLE_LIGHT, C_PURPLE_BORDER, C_PURPLE_MED),
        (1.45, 1.25, "TIER 3: DUAL COMPUTATION & INTELLIGENCE ENGINES", C_EMERALD_LIGHT, C_EMERALD_BORDER, C_EMERALD_MED),
        (0.12, 1.18, "TIER 4: RESILIENT PERSISTENCE & TELEMETRY TIER", C_AMBER_LIGHT, C_AMBER_BORDER, C_AMBER_MED)
    ]

    for y_bot, h, title, bg, border, banner in tiers:
        rect = FancyBboxPatch((0.2, y_bot), 7.2, h, boxstyle="round,pad=0.03,rounding_size=0.1",
                              facecolor=bg, edgecolor=border, linewidth=1.6)
        ax.add_patch(rect)
        hdr = FancyBboxPatch((0.2, y_bot + h - 0.28), 7.2, 0.28, boxstyle="round,pad=0.0,rounding_size=0.06",
                             facecolor=banner, edgecolor=banner)
        ax.add_patch(hdr)
        ax.text(0.35, y_bot + h - 0.14, title, fontsize=9.5, fontweight='bold', color=C_WHITE, va='center')

    # TIER 1 MODULES
    t1 = [
        ("Dashboard Portal", "KPI Overview & Analytics", 0.38, 4.35, 2.1, 0.8),
        ("Project Intelligence", "ZIP Ingestion & Progress UI", 2.75, 4.35, 2.1, 0.8),
        ("Code Review Studio", "AI Critique & Diffs", 5.12, 4.35, 2.1, 0.8)
    ]
    for name, sub, x, y, w, h in t1:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.03", facecolor=C_WHITE, edgecolor=C_BLUE_BORDER, linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + w/2, y + 0.50, name, fontsize=10, fontweight='bold', ha='center', va='center', color=C_NAVY)
        ax.text(x + w/2, y + 0.22, sub, fontsize=8.5, fontweight='bold', ha='center', va='center', color=C_SLATE_MED)

    # TIER 2 MODULES
    t2 = [
        ("JWT Auth & RBAC", "Bcrypt Hashing (10 Rds)", 0.38, 2.95, 2.1, 0.8),
        ("Upload Gateway", "Multer Multipart & Sanitizer", 2.75, 2.95, 2.1, 0.8),
        ("Heartbeat Core", "30s Telemetry & Controllers", 5.12, 2.95, 2.1, 0.8)
    ]
    for name, sub, x, y, w, h in t2:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.03", facecolor=C_WHITE, edgecolor=C_PURPLE_BORDER, linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + w/2, y + 0.50, name, fontsize=10, fontweight='bold', ha='center', va='center', color=C_NAVY)
        ax.text(x + w/2, y + 0.22, sub, fontsize=8.5, fontweight='bold', ha='center', va='center', color=C_SLATE_MED)

    # TIER 3 MODULES
    t3 = [
        ("Ephemeral Sandbox", "Zip-Slip Containment", 0.38, 1.55, 2.1, 0.8),
        ("Deterministic AST", "LOC, Complexity & MI", 2.75, 1.55, 2.1, 0.8),
        ("Dual-Model AI Engine", "Gemini 2.5 Flash -> 1.5 Pro", 5.12, 1.55, 2.1, 0.8)
    ]
    for name, sub, x, y, w, h in t3:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.03", facecolor=C_WHITE, edgecolor=C_EMERALD_BORDER, linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + w/2, y + 0.50, name, fontsize=10, fontweight='bold', ha='center', va='center', color=C_NAVY)
        ax.text(x + w/2, y + 0.22, sub, fontsize=8.5, fontweight='bold', ha='center', va='center', color=C_SLATE_MED)

    # TIER 4 MODULES
    t4 = [
        ("MongoDB Atlas (Cloud)", "Primary Replica Cluster", 0.38, 0.22, 2.1, 0.76),
        ("Local Daemon Failover", "Auto Failover (Port 27017)", 2.75, 0.22, 2.1, 0.76),
        ("Audit Logs & Presence", "TTL Indexes & Telemetry", 5.12, 0.22, 2.1, 0.76)
    ]
    for name, sub, x, y, w, h in t4:
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.03", facecolor=C_WHITE, edgecolor=C_AMBER_BORDER, linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + w/2, y + 0.46, name, fontsize=9.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
        ax.text(x + w/2, y + 0.20, sub, fontsize=8.5, fontweight='bold', ha='center', va='center', color=C_SLATE_MED)

    # Clear vertical arrows connecting tiers without crossing
    xs = [1.43, 3.8, 6.17]
    for x in xs:
        # T1 -> T2
        ax.add_patch(FancyArrowPatch((x, 4.35), (x, 3.97), arrowstyle='<|-|>', mutation_scale=13, linewidth=1.8, color=C_BLUE_MED))
        # T2 -> T3
        ax.add_patch(FancyArrowPatch((x, 2.95), (x, 2.57), arrowstyle='<|-|>', mutation_scale=13, linewidth=1.8, color=C_PURPLE_MED))
        # T3 -> T4
        ax.add_patch(FancyArrowPatch((x, 1.55), (x, 1.18), arrowstyle='<|-|>', mutation_scale=13, linewidth=1.8, color=C_EMERALD_MED))

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_system_architecture.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_system_architecture.png")


# =============================================================================
# 2. FIG 5.2: FIVE-STAGE ANALYSIS PIPELINE & RESILIENCE FLOWCHART
# =============================================================================
def draw_pipeline_stages():
    fig, ax = plt.subplots(figsize=(7.6, 5.8), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 5.8)
    ax.axis('off')

    ax.text(3.8, 5.55, "Five-Stage Analysis Pipeline & AI Resilience Flowchart", 
            fontsize=12.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.30, "Figure 5.2: Ephemeral Decompression to Calibrated Persistence", 
            fontsize=10, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    stages = [
        ("STAGE 1: INGESTION & SECURITY GUARD", "AdmZip Decompress, Zip-Slip Path Traversal Sanitization & Binary Filtering", 
         4.45, C_BLUE_LIGHT, C_BLUE_BORDER, C_BLUE_MED),
        ("STAGE 2: DETERMINISTIC AST METRICS", "Babel & AST Parsing: SLOC, Cyclomatic Complexity, Halstead Volume, Maintainability Index", 
         3.45, C_PURPLE_LIGHT, C_PURPLE_BORDER, C_PURPLE_MED),
        ("STAGE 3: BOUNDARY-AWARE BATCHING", "File Batching (15k Char Cap) & Context Window Trimming Preserving Import Contracts", 
         2.45, C_EMERALD_LIGHT, C_EMERALD_BORDER, C_EMERALD_MED),
        ("STAGE 4: DUAL-MODEL AI SYNTHESIS", "Gemini 2.5 Flash Primary Evaluation with Automatic Failover to Gemini 1.5 Pro on Rate Limit", 
         1.45, C_AMBER_LIGHT, C_AMBER_BORDER, C_AMBER_MED),
        ("STAGE 5: PERSISTENCE & TELEMETRY", "Calibrated Quality Score (0-100), MongoDB Atlas Bulk Write & Live Presence Heartbeat", 
         0.45, C_SLATE_LIGHT, C_SLATE_MED, C_SLATE_DARK)
    ]

    for title, desc, y, bg, border, banner in stages:
        rect = FancyBboxPatch((0.4, y), 6.8, 0.78, boxstyle="round,pad=0.03,rounding_size=0.1",
                              facecolor=bg, edgecolor=border, linewidth=1.6)
        ax.add_patch(rect)
        hdr = FancyBboxPatch((0.4, y + 0.52), 6.8, 0.26, boxstyle="round,pad=0.0,rounding_size=0.05",
                             facecolor=banner, edgecolor=banner)
        ax.add_patch(hdr)
        ax.text(0.55, y + 0.65, title, fontsize=9.5, fontweight='bold', color=C_WHITE, va='center')
        ax.text(3.8, y + 0.26, desc, fontsize=8.5, fontweight='bold', color=C_NAVY, ha='center', va='center')

    # Connecting arrows between stages
    arrow_ys = [4.45, 3.45, 2.45, 1.45]
    for y in arrow_ys:
        ax.add_patch(FancyArrowPatch((3.8, y), (3.8, y - 0.22), arrowstyle='-|>', mutation_scale=14, linewidth=2.0, color=C_NAVY))

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_pipeline_stages.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_pipeline_stages.png")


# =============================================================================
# 3. FIG 6.1: UNIFIED USE CASE DIAGRAM
# =============================================================================
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    ax.text(3.8, 5.95, "Unified Developer Intelligence Hub - UML Use Case Diagram", 
            fontsize=12, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 6.1: Actor Roles, System Boundaries, and External AI / DB Interactions", 
            fontsize=9.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    # Platform boundary
    boundary = FancyBboxPatch((1.65, 0.15), 4.3, 5.35, boxstyle="round,pad=0.04,rounding_size=0.12",
                              facecolor='#fafafa', edgecolor=C_SLATE_DARK, linewidth=1.6)
    ax.add_patch(boundary)
    ax.text(3.8, 5.32, "UDIH System Platform Boundary", fontsize=10, fontweight='bold', color=C_SLATE_DARK, ha='center')

    # Draw Actor Helper
    def draw_actor(x, y, label, color):
        ax.add_patch(patches.Circle((x, y), 0.18, facecolor=C_WHITE, edgecolor=color, linewidth=2.0))
        ax.plot([x, x], [y - 0.18, y - 0.55], color=color, linewidth=2.0)
        ax.plot([x - 0.26, x + 0.26], [y - 0.32, y - 0.32], color=color, linewidth=2.0)
        ax.plot([x, x - 0.22], [y - 0.55, y - 0.90], color=color, linewidth=2.0)
        ax.plot([x, x + 0.22], [y - 0.55, y - 0.90], color=color, linewidth=2.0)
        ax.text(x, y - 1.10, label, fontsize=9.5, fontweight='bold', color=color, ha='center', va='center')

    # Actors
    draw_actor(0.8, 3.8, "Developer\n(Standard User)", C_BLUE_MED)
    draw_actor(6.8, 3.8, "Administrator\n(Privileged Role)", C_PURPLE_MED)

    # External AI & DB cards
    ai_box = FancyBboxPatch((6.15, 4.8), 1.35, 0.65, boxstyle="round,pad=0.03", facecolor=C_EMERALD_LIGHT, edgecolor=C_EMERALD_BORDER, linewidth=1.4)
    ax.add_patch(ai_box)
    ax.text(6.82, 5.12, "<<External AI>>\nGemini 2.5 Flash", fontsize=8.5, fontweight='bold', color=C_EMERALD_DARK, ha='center', va='center')

    db_box = FancyBboxPatch((6.15, 0.3), 1.35, 0.65, boxstyle="round,pad=0.03", facecolor=C_AMBER_LIGHT, edgecolor=C_AMBER_BORDER, linewidth=1.4)
    ax.add_patch(db_box)
    ax.text(6.82, 0.62, "<<Database>>\nMongoDB Atlas", fontsize=8.5, fontweight='bold', color=C_AMBER_DARK, ha='center', va='center')

    # Use Cases (Vertical stack of 7 centered ellipses)
    ucs = [
        ("Register & Authenticate", 4.80, C_BLUE_BORDER),
        ("Upload Repository ZIP", 4.10, C_BLUE_BORDER),
        ("Execute AST Static Scan", 3.40, C_BLUE_BORDER),
        ("Inspect Quality & Health Score", 2.70, C_BLUE_BORDER),
        ("Request AI Semantic Review", 2.00, C_EMERALD_BORDER),
        ("View 30-Day Project Analytics", 1.30, C_BLUE_BORDER),
        ("Manage Users & Live Presence", 0.55, C_PURPLE_BORDER)
    ]

    for label, y, border in ucs:
        ell = patches.Ellipse((3.8, y), 2.9, 0.52, facecolor=C_WHITE, edgecolor=border, linewidth=1.5)
        ax.add_patch(ell)
        ax.text(3.8, y, label, fontsize=9, fontweight='bold', color=C_NAVY, ha='center', va='center')

    # Developer connection lines (fan from x=1.05 to x=2.35)
    dev_ys = [4.80, 4.10, 3.40, 2.70, 2.00, 1.30]
    for ty in dev_ys:
        ax.plot([1.1, 2.35], [3.6, ty], color=C_BLUE_MED, linewidth=1.4)

    # Admin connection lines (fan from x=6.55 to x=5.25)
    admin_ys = [4.80, 1.30, 0.55]
    for ty in admin_ys:
        ax.plot([6.5, 5.25], [3.6, ty], color=C_PURPLE_MED, linewidth=1.4)

    # System External Connectors (Dashed arrows with clear endpoints)
    ax.add_patch(FancyArrowPatch((5.25, 2.00), (6.15, 4.8), arrowstyle='-|>', mutation_scale=12,
                                linewidth=1.4, linestyle='--', color=C_EMERALD_MED))
    ax.add_patch(FancyArrowPatch((5.25, 1.30), (6.15, 0.8), arrowstyle='-|>', mutation_scale=12,
                                linewidth=1.4, linestyle='--', color=C_AMBER_MED))

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_use_case_diagram.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_use_case_diagram.png")


# =============================================================================
# 4. FIG 6.2: SYSTEM SEQUENCE DIAGRAM
# =============================================================================
def draw_sequence_diagram():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    ax.text(3.8, 5.95, "UDIH Project Intelligence Sequence Diagram", 
            fontsize=12.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 6.2: Synchronous Request-Response Flow with Dual-Model AI", 
            fontsize=9.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    lifelines = [
        ("Developer\n(React UI)", 0.8, C_BLUE_LIGHT, C_BLUE_BORDER),
        ("Express API\nGateway", 2.3, C_PURPLE_LIGHT, C_PURPLE_BORDER),
        ("Preprocessor\nEngine", 3.8, C_EMERALD_LIGHT, C_EMERALD_BORDER),
        ("Gemini AI\nResilience", 5.3, C_AMBER_LIGHT, C_AMBER_BORDER),
        ("MongoDB\nAtlas Cluster", 6.8, C_SLATE_LIGHT, C_SLATE_MED)
    ]

    for label, x, bg, border in lifelines:
        box = FancyBboxPatch((x - 0.65, 5.0), 1.3, 0.55, boxstyle="round,pad=0.03", facecolor=bg, edgecolor=border, linewidth=1.4)
        ax.add_patch(box)
        ax.text(x, 5.27, label, fontsize=8.5, fontweight='bold', color=C_NAVY, ha='center', va='center')
        ax.plot([x, x], [5.0, 0.3], color=C_SLATE_MED, linewidth=1.2, linestyle=':')

    # Calls: y, x1, x2, msg, is_return
    calls = [
        (4.55, 0.8, 2.3, "1: POST /upload (ZIP Archive)", False),
        (4.05, 2.3, 3.8, "2: Decompress & Scan Static AST", False),
        (3.55, 3.8, 2.3, "3: Return Manifest & AST Metrics", True),
        (3.05, 2.3, 5.3, "4: Stage 2 & 3: Architecture Prompt", False),
        (2.55, 5.3, 2.3, "5: Return Semantic Analysis JSON", True),
        (2.05, 2.3, 6.8, "6: Persist Project & Analysis Records", False),
        (1.55, 6.8, 2.3, "7: Write Confirmation (ObjectId)", True),
        (1.05, 2.3, 0.8, "8: 200 OK + Health Score (80/100)", True)
    ]

    for y, x1, x2, msg, is_return in calls:
        color = C_BLUE_MED if not is_return else C_EMERALD_MED
        ls = '-' if not is_return else '--'
        ax.add_patch(FancyArrowPatch((x1, y), (x2, y), arrowstyle='-|>', mutation_scale=12,
                                    linewidth=1.6, linestyle=ls, color=color))
        mid_x = (x1 + x2) / 2
        add_label_box(ax, mid_x, y + 0.18, msg, color=color, bg=C_WHITE, border=color, fontsize=8.2, pad=0.15)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_sequence_diagram.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_sequence_diagram.png")


# =============================================================================
# 5. FIG 6.3: ACTIVITY DIAGRAM FOR MULTI-STAGE PIPELINE
# =============================================================================
def draw_activity_diagram():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    ax.text(3.8, 5.95, "UDIH Project Intelligence Activity Lifecycle", 
            fontsize=12.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 6.3: Sequential Processing & AI Fault-Tolerant Execution", 
            fontsize=9.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    # Initial Node (Solid black circle)
    ax.add_patch(patches.Circle((3.8, 5.4), 0.15, facecolor=C_NAVY, edgecolor=C_NAVY))

    # Activity Nodes (y, label, bg, border)
    steps = [
        (4.70, "1. Ingest Repository ZIP & Extract to Ephemeral Sandbox", C_BLUE_LIGHT, C_BLUE_BORDER),
        (3.95, "2. Zip-Slip Defense & Filtering of Binaries / .env Files", C_PURPLE_LIGHT, C_PURPLE_BORDER),
        (3.20, "3. Calculate Static AST Metrics (LOC, Cyclomatic Complexity)", C_EMERALD_LIGHT, C_EMERALD_BORDER),
        (2.45, "4. Truncate Prompts & Execute Dual-Model Gemini AI Synthesis", C_AMBER_LIGHT, C_AMBER_BORDER),
        (1.70, "5. Calibrate Overall Quality Score (0-100) & Deductions", C_SLATE_LIGHT, C_SLATE_MED),
        (0.95, "6. Batch Persist into MongoDB Atlas Collections", C_RED_LIGHT, C_RED_BORDER)
    ]

    prev_y = 5.25
    for y, label, bg, border in steps:
        ax.add_patch(FancyArrowPatch((3.8, prev_y), (3.8, y + 0.26), arrowstyle='-|>', mutation_scale=13,
                                    linewidth=1.8, color=C_NAVY))
        rect = FancyBboxPatch((0.8, y - 0.22), 6.0, 0.44, boxstyle="round,pad=0.03,rounding_size=0.08",
                              facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(3.8, y, label, fontsize=9.2, fontweight='bold', color=C_NAVY, ha='center', va='center')
        prev_y = y - 0.22

    # Final Node (Bullseye)
    ax.add_patch(FancyArrowPatch((3.8, prev_y), (3.8, 0.46), arrowstyle='-|>', mutation_scale=13,
                                linewidth=1.8, color=C_NAVY))
    ax.add_patch(patches.Circle((3.8, 0.30), 0.16, facecolor=C_WHITE, edgecolor=C_NAVY, linewidth=1.8))
    ax.add_patch(patches.Circle((3.8, 0.30), 0.10, facecolor=C_NAVY, edgecolor=C_NAVY))

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_activity_diagram.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_activity_diagram.png")


# =============================================================================
# 6. FIG 6.4: LEVEL 1 DATA FLOW DIAGRAM (DFD)
# =============================================================================
def draw_dfd_level1():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    ax.text(3.8, 5.95, "Unified Developer Intelligence Hub - Level 1 DFD", 
            fontsize=12.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 6.4: Code Analysis & Review Engine Data Transformations", 
            fontsize=9.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    # External Entities
    # Developer (Left)
    e_dev = FancyBboxPatch((0.3, 4.0), 1.5, 0.9, boxstyle="round,pad=0.03", facecolor=C_BLUE_LIGHT, edgecolor=C_BLUE_BORDER, linewidth=1.5)
    ax.add_patch(e_dev)
    ax.text(1.05, 4.58, "External Entity:", fontsize=8.5, fontweight='bold', color=C_BLUE_DARK, ha='center')
    ax.text(1.05, 4.30, "Developer", fontsize=10.5, fontweight='bold', color=C_NAVY, ha='center')

    # Gemini AI (Right)
    e_ai = FancyBboxPatch((5.8, 2.0), 1.5, 0.9, boxstyle="round,pad=0.03", facecolor=C_EMERALD_LIGHT, edgecolor=C_EMERALD_BORDER, linewidth=1.5)
    ax.add_patch(e_ai)
    ax.text(6.55, 2.58, "External Entity:", fontsize=8.5, fontweight='bold', color=C_EMERALD_DARK, ha='center')
    ax.text(6.55, 2.30, "Gemini AI API", fontsize=10.5, fontweight='bold', color=C_NAVY, ha='center')

    # Processes (4 Process Cards vertically arranged)
    procs = [
        ("1.0", "Ingest & Decompress\nZIP Archive", 2.6, 4.45),
        ("2.0", "Sanitize Paths &\nZip-Slip Defense", 4.7, 4.45),
        ("3.0", "Calculate Deterministic\nAST Metrics", 4.7, 3.10),
        ("4.0", "Prune Context &\nSynthesize AI Review", 4.7, 1.75)
    ]
    for pnum, pname, cx, cy in procs:
        box = FancyBboxPatch((cx - 0.95, cy - 0.42), 1.9, 0.84, boxstyle="round,pad=0.03,rounding_size=0.08",
                             facecolor=C_WHITE, edgecolor=C_PURPLE_BORDER, linewidth=1.5)
        ax.add_patch(box)
        hdr = FancyBboxPatch((cx - 0.95, cy + 0.18), 1.9, 0.24, boxstyle="round,pad=0.0,rounding_size=0.05",
                             facecolor=C_PURPLE_MED, edgecolor=C_PURPLE_MED)
        ax.add_patch(hdr)
        ax.text(cx, cy + 0.30, f"Process {pnum}", fontsize=8.5, fontweight='bold', color=C_WHITE, ha='center', va='center')
        ax.text(cx, cy - 0.12, pname, fontsize=8.5, fontweight='bold', color=C_NAVY, ha='center', va='center')

    # Data Stores
    def draw_ds(x, y, w, h, ds_id, name):
        ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color=C_AMBER_DARK, linewidth=1.8)
        ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color=C_AMBER_DARK, linewidth=1.8)
        ax.fill_between([x - w/2, x + w/2], y - h/2, y + h/2, facecolor=C_AMBER_LIGHT)
        ax.text(x - w/2 + 0.32, y, ds_id, fontsize=9, fontweight='bold', color=C_AMBER_DARK, va='center')
        ax.text(x + 0.22, y, name, fontsize=9, fontweight='bold', color=C_NAVY, va='center', ha='center')

    draw_ds(2.6, 3.10, 2.0, 0.55, "DS-1", "Projects & Metrics")
    draw_ds(2.6, 1.75, 2.0, 0.55, "DS-2", "CodeReview Reports")

    # Data Flow Connectors (Thick arrows with opaque white label boxes)
    # Dev -> 1.0
    ax.add_patch(FancyArrowPatch((1.8, 4.45), (1.65, 4.45), arrowstyle='-|>', mutation_scale=13, color=C_BLUE_MED, linewidth=1.8))
    add_label_box(ax, 1.68, 4.80, "ZIP File", color=C_BLUE_MED, border=C_BLUE_BORDER, fontsize=8)

    # 1.0 -> 2.0
    ax.add_patch(FancyArrowPatch((3.55, 4.45), (3.75, 4.45), arrowstyle='-|>', mutation_scale=13, color=C_NAVY, linewidth=1.8))
    add_label_box(ax, 3.65, 4.80, "File Tree", color=C_NAVY, border=C_SLATE_MED, fontsize=8)

    # 2.0 -> 3.0
    ax.add_patch(FancyArrowPatch((4.7, 4.03), (4.7, 3.52), arrowstyle='-|>', mutation_scale=13, color=C_NAVY, linewidth=1.8))
    add_label_box(ax, 5.35, 3.78, "Clean AST", color=C_NAVY, border=C_SLATE_MED, fontsize=8)

    # 3.0 -> DS-1
    ax.add_patch(FancyArrowPatch((3.75, 3.10), (3.60, 3.10), arrowstyle='-|>', mutation_scale=13, color=C_AMBER_DARK, linewidth=1.8))
    add_label_box(ax, 3.68, 3.42, "Save Metrics", color=C_AMBER_DARK, border=C_AMBER_BORDER, fontsize=7.8)

    # 3.0 -> 4.0
    ax.add_patch(FancyArrowPatch((4.7, 2.68), (4.7, 2.17), arrowstyle='-|>', mutation_scale=13, color=C_NAVY, linewidth=1.8))
    add_label_box(ax, 5.42, 2.42, "AST Tokens", color=C_NAVY, border=C_SLATE_MED, fontsize=8)

    # 4.0 <-> Gemini AI
    ax.add_patch(FancyArrowPatch((5.65, 1.95), (5.80, 2.25), arrowstyle='-|>', mutation_scale=12, color=C_EMERALD_MED, linewidth=1.8))
    add_label_box(ax, 5.75, 1.45, "Prompt / DTO", color=C_EMERALD_DARK, border=C_EMERALD_BORDER, fontsize=7.8)

    # 4.0 -> DS-2
    ax.add_patch(FancyArrowPatch((3.75, 1.75), (3.60, 1.75), arrowstyle='-|>', mutation_scale=13, color=C_AMBER_DARK, linewidth=1.8))
    add_label_box(ax, 3.68, 1.42, "Save Review", color=C_AMBER_DARK, border=C_AMBER_BORDER, fontsize=7.8)

    # DS-1 -> Developer Dashboard
    ax.add_patch(FancyArrowPatch((1.6, 3.10), (1.05, 4.0), arrowstyle='-|>', mutation_scale=12, color=C_BLUE_MED, linewidth=1.6, linestyle='--'))
    add_label_box(ax, 1.25, 3.40, "Telemetry UI", color=C_BLUE_MED, border=C_BLUE_BORDER, fontsize=7.8)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_dfd_level1.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_dfd_level1.png")


# =============================================================================
# 7. FIG 6.5: ENTITY-RELATIONSHIP (ER) DIAGRAM
# =============================================================================
def draw_er_diagram():
    fig, ax = plt.subplots(figsize=(7.6, 6.2), dpi=300)
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    ax.text(3.8, 5.95, "UDIH MongoDB Database Entity-Relationship Diagram", 
            fontsize=12.5, fontweight='bold', ha='center', va='center', color=C_NAVY)
    ax.text(3.8, 5.70, "Figure 6.5: Schema Entities, Field Types, and Referential Integrity", 
            fontsize=9.5, fontweight='bold', fontstyle='italic', ha='center', va='center', color=C_SLATE_MED)

    # 6 Entities arranged in 2 columns x 3 rows
    # Col 1: x = 0.4, w = 3.2
    # Col 2: x = 4.0, w = 3.2
    entities = [
        # (x, y, w, h, title, [attrs], color_tuple)
        (0.4, 3.90, 3.2, 1.65, "User", [
            ("PK", "_id", "ObjectId"),
            ("REQ", "name", "String"),
            ("UK", "email", "String"),
            ("SEC", "password", "Hash (Bcrypt)"),
            ("ENUM", "role", "admin | developer"),
            ("ENUM", "status", "active | offline"),
            ("TIME", "lastActive", "Date")
        ], (C_BLUE_MED, C_BLUE_LIGHT, C_BLUE_BORDER)),

        (4.0, 3.90, 3.2, 1.65, "Project", [
            ("PK", "_id", "ObjectId"),
            ("FK", "owner", "ObjectId (-> User)"),
            ("REQ", "name", "String"),
            ("ATTR", "description", "String"),
            ("ARR", "languages", "Array[String]"),
            ("NUM", "fileCount", "Number"),
            ("TIME", "lastAnalyzedAt", "Date")
        ], (C_PURPLE_MED, C_PURPLE_LIGHT, C_PURPLE_BORDER)),

        (0.4, 2.05, 3.2, 1.65, "ProjectAnalysis", [
            ("PK", "_id", "ObjectId"),
            ("FK", "project", "ObjectId (-> Project)"),
            ("FK", "user", "ObjectId (-> User)"),
            ("NUM", "qualityScore", "Number (0-100)"),
            ("OBJ", "architecture", "Object"),
            ("STR", "summary", "String"),
            ("STR", "dataFlow", "String")
        ], (C_EMERALD_MED, C_EMERALD_LIGHT, C_EMERALD_BORDER)),

        (4.0, 2.05, 3.2, 1.65, "CodeReview", [
            ("PK", "_id", "ObjectId"),
            ("FK", "user", "ObjectId (-> User)"),
            ("FK", "project", "ObjectId (-> Project)"),
            ("REQ", "title", "String"),
            ("NUM", "score", "Number"),
            ("ENUM", "status", "pending | completed"),
            ("ARR", "comments", "Array[Comment]")
        ], (C_AMBER_MED, C_AMBER_LIGHT, C_AMBER_BORDER)),

        (0.4, 0.20, 3.2, 1.65, "ProjectIssue", [
            ("PK", "_id", "ObjectId"),
            ("FK", "project", "ObjectId (-> Project)"),
            ("FK", "analysis", "ObjectId (-> Analysis)"),
            ("ENUM", "severity", "critical | warning"),
            ("STR", "title", "String"),
            ("STR", "filePath", "String"),
            ("ARR", "suggestedFix", "String")
        ], (C_RED_MED, C_RED_LIGHT, C_RED_BORDER)),

        (4.0, 0.20, 3.2, 1.65, "ActivityLog", [
            ("PK", "_id", "ObjectId"),
            ("FK", "user", "ObjectId (-> User)"),
            ("ENUM", "action", "login | analyze | review"),
            ("OBJ", "details", "Object"),
            ("STR", "ipAddress", "String"),
            ("TIME", "createdAt", "Date (TTL 90d)")
        ], (C_SLATE_DARK, C_SLATE_LIGHT, C_SLATE_MED))
    ]

    for x, y, w, h, title, attrs, (banner, bg, border) in entities:
        # Card Body
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.06",
                             facecolor=C_WHITE, edgecolor=border, linewidth=1.5)
        ax.add_patch(box)
        # Header
        hdr = FancyBboxPatch((x, y + h - 0.26), w, 0.26, boxstyle="round,pad=0.0,rounding_size=0.04",
                             facecolor=banner, edgecolor=banner)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.13, f"Collection: {title}", fontsize=9, fontweight='bold', color=C_WHITE, ha='center', va='center')
        
        # Attributes
        line_y = y + h - 0.44
        for tag, field, ftype in attrs:
            ax.text(x + 0.12, line_y, tag, fontsize=7.5, fontweight='bold', color=banner, va='center')
            ax.text(x + 0.65, line_y, field, fontsize=8.2, fontweight='bold', color=C_NAVY, va='center')
            ax.text(x + w - 0.10, line_y, ftype, fontsize=7.8, color=C_SLATE_MED, va='center', ha='right')
            line_y -= 0.19

    # Clean relationships (1:N connectors)
    # User -> Project (1:N)
    ax.plot([3.6, 4.0], [4.72, 4.72], color=C_NAVY, linewidth=1.8)
    add_label_box(ax, 3.8, 4.72, "1 : N", color=C_NAVY, border=C_SLATE_MED, fontsize=7.5, pad=0.1)

    # Project -> ProjectAnalysis (1:N)
    ax.plot([4.0, 3.6], [3.9, 3.7], color=C_NAVY, linewidth=1.8)
    add_label_box(ax, 3.8, 3.8, "1 : N", color=C_NAVY, border=C_SLATE_MED, fontsize=7.5, pad=0.1)

    # Project -> CodeReview (1:N)
    ax.plot([5.6, 5.6], [3.9, 3.7], color=C_NAVY, linewidth=1.8)
    add_label_box(ax, 5.6, 3.8, "1 : N", color=C_NAVY, border=C_SLATE_MED, fontsize=7.5, pad=0.1)

    # ProjectAnalysis -> ProjectIssue (1:N)
    ax.plot([2.0, 2.0], [2.05, 1.85], color=C_NAVY, linewidth=1.8)
    add_label_box(ax, 2.0, 1.95, "1 : N", color=C_NAVY, border=C_SLATE_MED, fontsize=7.5, pad=0.1)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, "fig_er_diagram.png"), dpi=300)
    plt.close()
    print("SUCCESS: fig_er_diagram.png")


if __name__ == '__main__':
    print("Regenerating ALL 7 diagrams with ultra-high legibility & clean proportions...")
    draw_system_architecture()
    draw_pipeline_stages()
    draw_use_case_diagram()
    draw_sequence_diagram()
    draw_activity_diagram()
    draw_dfd_level1()
    draw_er_diagram()
    print("ALL 7 DIAGRAMS SUCCESSFULLY REGENERATED!")
