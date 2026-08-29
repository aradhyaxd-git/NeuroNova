import sys
sys.path.insert(0, '/Users/aradhya.dev/Library/Python/3.9/lib/python/site-packages')

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Omit header and footer on cover page (Page 1)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#6366f1"))
            self.drawString(54, 11 * 72 - 36, "NEURONOVA AI — SOLUTION DOCUMENTATION")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawRightString(8.5 * 72 - 54, 11 * 72 - 36, "ROUND 2 SUBMISSION")
            
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.75)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)

            # Footer
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.75)
            self.line(54, 48, 8.5 * 72 - 54, 48)

            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(54, 34, "AI-Powered Personalized Learning Path Recommender")
            
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(8.5 * 72 - 54, 34, page_text)
            
        self.restoreState()

def build_pdf(filename="NeuroNova_Solution_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary = colors.HexColor("#4f46e5")    # Indigo 600
    secondary = colors.HexColor("#0f172a")  # Slate 900
    accent = colors.HexColor("#10b981")     # Emerald 500
    text_dark = colors.HexColor("#1e293b")  # Slate 800
    text_muted = colors.HexColor("#64748b") # Slate 500
    bg_light = colors.HexColor("#f8fafc")   # Slate 50

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=primary,
        alignment=0
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=text_dark,
        alignment=0
    )
    
    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=secondary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_dark,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    story = []

    # ==========================================
    # PAGE 1: COVER & EXECUTIVE METADATA
    # ==========================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("NEURONOVA AI", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=accent, leading=12)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("AI-Powered Personalized Learning Path Recommender", title_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Comprehensive Solution Architecture, AI/ML Implementation & Technical Documentation", subtitle_style))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=2, color=primary, spaceAfter=14))

    # Executive Overview Callout
    exec_summary_html = """
    <b>Executive Summary:</b> NeuroNova is an end-to-end intelligent study assistant that transforms natural language career aspirations into adaptive multi-stage learning roadmaps. Powered by Google Gemini 2.5, WebGL 3D skill graph rendering, SQLite persistent storage, and automated PDF active recall parsers, NeuroNova delivers personalized educational pathways that dynamically adjust based on learner progress, time availability, and background experience.
    """
    
    exec_table = Table([[Paragraph(exec_summary_html, body_style)]], colWidths=[504])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 12))

    # Deliverables & Live Links Summary Table
    story.append(Paragraph("Project Deliverables Index & Application Access", h2_style))
    
    deliverables_data = [
        [Paragraph("<b>Deliverable</b>", body_style), Paragraph("<b>Status & Access Information</b>", body_style)],
        [Paragraph("<b>1. Source Code (ZIP)</b>", body_style), Paragraph("Clean build bundle prepared (excluding <code>node_modules</code>)", body_style)],
        [Paragraph("<b>2. GitHub Repository</b>", body_style), Paragraph("<font color='#4f46e5'><u>https://github.com/aradhyaxd-git/NeuroNova</u></font>", body_style)],
        [Paragraph("<b>3. Solution Documentation</b>", body_style), Paragraph("This PDF document (Architecture, AI/ML, Workflows)", body_style)],
        [Paragraph("<b>4. Live Frontend URL</b>", body_style), Paragraph("<font color='#4f46e5'><u>https://neuro-nova-psi.vercel.app</u></font>", body_style)],
        [Paragraph("<b>5. Live Backend API URL</b>", body_style), Paragraph("<font color='#4f46e5'><u>https://neuronova-1hin.onrender.com/api</u></font>", body_style)],
    ]
    
    deliv_table = Table(deliverables_data, colWidths=[160, 344])
    deliv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(deliv_table)
    
    story.append(Spacer(1, 12))

    # Judging Criteria Matrix
    story.append(Paragraph("Hackathon Evaluation Criteria Alignment", h2_style))
    criteria_data = [
        [Paragraph("<b>Criteria</b>", body_style), Paragraph("<b>Weight</b>", body_style), Paragraph("<b>NeuroNova Implementation Summary</b>", body_style)],
        [Paragraph("Problem Understanding", body_style), Paragraph("20%", body_style), Paragraph("Addresses learning sequence paralysis via adaptive personalized roadmaps.", body_style)],
        [Paragraph("Functionality Completeness", body_style), Paragraph("25%", body_style), Paragraph("Full 6-pillar engine: Chat, Intake, Roadmap, PDF Recall, Explainability, Trajectory.", body_style)],
        [Paragraph("AI/ML Implementation", body_style), Paragraph("20%", body_style), Paragraph("Gemini 2.5 Flash, structured JSON schemas, topic-aware doc resolver.", body_style)],
        [Paragraph("Innovation & Creativity", body_style), Paragraph("15%", body_style), Paragraph("12-section 3D WebGL scroll story, 3D active recall deck, local CanvasTexture sprites.", body_style)],
        [Paragraph("User Experience & Design", body_style), Paragraph("10%", body_style), Paragraph("Serene Light / Obsidian Dark themes, Jira-style Kanban, JetBrains Mono metrics.", body_style)],
        [Paragraph("Code Quality & Build", body_style), Paragraph("10%", body_style), Paragraph("Sub-500ms Vite build, SQLite persistence, error boundaries, clean REST endpoints.", body_style)],
    ]
    crit_table = Table(criteria_data, colWidths=[130, 54, 320])
    crit_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(crit_table)

    story.append(PageBreak())

    # ==========================================
    # PAGE 2: PROBLEM UNDERSTANDING & SOLUTION APPROACH
    # ==========================================
    story.append(Paragraph("1. Problem Understanding & Solution Approach", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    story.append(Paragraph("<b>The Modern Online Learning Crisis:</b>", h2_style))
    story.append(Paragraph(
        "Online educational platforms offer tens of thousands of courses. However, learners frequently suffer from <i>choice overload</i> and <i>sequence ambiguity</i>. A beginner wanting to become an AI Engineer cannot easily determine whether to study Linear Algebra, Python, React, or System Design first. Generic recommendations suggest isolated courses without building a structured, prerequisite-aware trajectory tailored to available weekly commitment.",
        body_style
    ))

    story.append(Paragraph("<b>The NeuroNova Solution Paradigm:</b>", h2_style))
    story.append(Paragraph(
        "NeuroNova introduces a personalized 3D learning intelligence platform that bridges this gap through a 6-pillar architecture:",
        body_style
    ))

    story.append(Paragraph("• <b>Natural Language Goal Processing:</b> Learners converse naturally with the AI advisor, expressing aspirations like <i>'I want to build production AI apps in 6 weeks (6 hrs/wk)'</i>.", bullet_style))
    story.append(Paragraph("• <b>Cognitive Learner Profiling:</b> Captures current experience level (Beginner, Intermediate, Advanced), weekly availability, and focus topics.", bullet_style))
    story.append(Paragraph("• <b>Structured 3D Roadmap Generation:</b> Builds a multi-stage curriculum with strict prerequisite chains, estimated completion hours, and milestone tracking.", bullet_style))
    story.append(Paragraph("• <b>PDF Active Recall Studio:</b> Extracts text from user-uploaded PDF lecture notes (via Multer + pdf-parse) to construct 3D interactive flashcards and practice quizzes.", bullet_style))
    story.append(Paragraph("• <b>Transparent AI Explainability:</b> Explains *why* each course or module is recommended and routes learners to topic-specific documentation (React.dev, Nodejs.org, Postgresql.org).", bullet_style))
    story.append(Paragraph("• <b>Skill Trajectory Dashboard:</b> Visualizes real-time competency growth deltas (+15% growth) and next recommended actions.", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("2. System Architecture & Technical Design", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    arch_text = """
    <b>Monorepo Full-Stack Architecture:</b><br/>
    • <b>Client Tier:</b> React 19, Vite, Three.js (@react-three/fiber, @react-three/drei), Framer Motion, Simple Icons.<br/>
    • <b>Server Tier:</b> Node.js Express REST API, Multer memory storage, pdf-parse extraction engine.<br/>
    • <b>Database Tier:</b> SQLite (better-sqlite3) persisting profiles, roadmaps, module progress, and chat history.<br/>
    • <b>AI Tier:</b> Google Gemini 2.5 Flash SDK (@google/genai) enforcing strict JSON response schemas.
    """
    arch_box = Table([[Paragraph(arch_text, body_style)]], colWidths=[504])
    arch_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 10)
    ]))
    story.append(arch_box)

    story.append(PageBreak())

    # ==========================================
    # PAGE 3: AI/ML TECHNIQUES & PROMPT ENGINEERING
    # ==========================================
    story.append(Paragraph("3. AI/ML Techniques & Engineering Implementation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    story.append(Paragraph("<b>1. Google Gemini 2.5 Structured JSON Generation:</b>", h2_style))
    story.append(Paragraph(
        "NeuroNova leverages Google Gemini 2.5 Flash (`gemini-2.5-flash`) configured with <code>responseMimeType: 'application/json'</code>. This guarantees 100% deterministic JSON output matching strict application TypeScript/Zod schemas without markdown formatting errors.",
        body_style
    ))

    prompt_example = """
    // Express Server Prompt Schema (server/src/index.js)
    const prompt = `You are NeuroNova, an expert AI Curriculum Architect.
    Generate a structured learning path for: Goal: ${goal}, Level: ${level}, Topics: ${interests}, Commitment: ${hours} hrs/wk.
    Return ONLY valid JSON matching schema:
    {
      "title": "...", "summary": "...", "targetDurationWeeks": 4, "totalMilestones": 4,
      "stages": [{"id": "stage_1", "title": "...", "modules": [...]}]
    }`;
    """
    story.append(Table([[Paragraph(f"<code>{prompt_example.strip()}</code>", code_style)]], colWidths=[504], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#f8fafc"))
    ]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>2. Automated PDF active recall & Study Set Extraction:</b>", h2_style))
    story.append(Paragraph(
        "When users upload lecture notes or textbook PDFs, Multer intercepts the binary stream in memory, while <code>pdf-parse</code> extracts up to 15,000 text characters. Gemini processes the text into structured flashcards and quiz questions with detailed explanations.",
        body_style
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>3. Topic-Aware Documentation Link Resolver:</b>", h2_style))
    story.append(Paragraph(
        "To eliminate broken or generic fallback links, NeuroNova features a dynamic documentation router (<code>resolveDocUrl</code>) that inspects module metadata and directs learners to exact official resources:",
        body_style
    ))

    doc_routes = [
        [Paragraph("<b>Technology Keyword</b>", body_style), Paragraph("<b>Resolved Official Documentation Link</b>", body_style)],
        [Paragraph("React / State Management", body_style), Paragraph("<code>https://react.dev/learn</code>", body_style)],
        [Paragraph("Node.js / Express API", body_style), Paragraph("<code>https://nodejs.org/docs/latest/api/</code>", body_style)],
        [Paragraph("PostgreSQL / SQL", body_style), Paragraph("<code>https://www.postgresql.org/docs/</code>", body_style)],
        [Paragraph("Redis / Caching", body_style), Paragraph("<code>https://redis.io/docs/</code>", body_style)],
        [Paragraph("TypeScript", body_style), Paragraph("<code>https://www.typescriptlang.org/docs/</code>", body_style)],
        [Paragraph("Python & Data Science", body_style), Paragraph("<code>https://docs.python.org/3/</code>", body_style)],
        [Paragraph("OpenAI / LLM Integration", body_style), Paragraph("<code>https://platform.openai.com/docs/</code>", body_style)],
        [Paragraph("Docker & Infrastructure", body_style), Paragraph("<code>https://docs.docker.com/</code>", body_style)],
        [Paragraph("System Design", body_style), Paragraph("<code>https://roadmap.sh/system-design</code>", body_style)]
    ]
    doc_table = Table(doc_routes, colWidths=[160, 344])
    doc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(doc_table)

    story.append(PageBreak())

    # ==========================================
    # PAGE 4: KEY FEATURES & WORKFLOWS
    # ==========================================
    story.append(Paragraph("4. Key Features & End-to-End Workflows", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    story.append(Paragraph("<b>End-to-End User Journey:</b>", h2_style))

    w1 = "<b>Step 1: Goal Expression & Conversational Intake</b><br/>The learner describes their aspiration in natural language. The AI advisor responds, asking clarifying questions while extracting structured profile attributes (Goal, Level, Weekly Hours, Focus Topics)."
    w2 = "<b>Step 2: Interactive 3D Roadmap Generation</b><br/>Upon clicking 'Generate 3D Learning Path', the backend constructs a multi-stage roadmap. The user explores the path across 3 views: Jira-style Kanban Board, Sequential Stage Timeline, or Compact List Table."
    w3 = "<b>Step 3: Module Inspection & AI Recommendation Rationale</b><br/>Clicking any module opens the slide-over drawer or explainability modal, displaying exact reasons why the module was chosen, skills gained, and direct links to official documentation."
    w4 = "<b>Step 4: Active Recall & PDF Study Studio</b><br/>The learner launches the Practice Studio for any module or uploads their own PDF notes. The system builds an interactive 3D active recall flashcard deck and practice quiz."
    w5 = "<b>Step 5: Skill Trajectory Tracking</b><br/>As the learner marks modules as 'Mastered', the Skill Trajectory Dashboard updates overall path progress, milestone velocity, and real-time competency growth deltas (+18% growth)."

    for w in [w1, w2, w3, w4, w5]:
        w_box = Table([[Paragraph(w, body_style)]], colWidths=[504])
        w_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
            ('PADDING', (0,0), (-1,-1), 7)
        ]))
        story.append(w_box)
        story.append(Spacer(1, 5))

    story.append(PageBreak())

    # ==========================================
    # PAGE 5: 3D WEBGL ENGINE & DESIGN SYSTEM
    # ==========================================
    story.append(Paragraph("5. 3D WebGL Neural Engine & Design System", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    story.append(Paragraph("<b>12-Section Continuous 3D Scroll Narrative Page:</b>", h2_style))
    story.append(Paragraph(
        "The landing page features a continuous 3D WebGL scroll narrative built with Three.js (`@react-three/fiber` and `@react-three/drei`). Unlike standard landing pages with disconnected images, NeuroNova embeds an interactive neural knowledge core that reacts dynamically to scroll progress.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Zero-CDN Local CanvasTexture Sprites:</b>", h2_style))
    story.append(Paragraph(
        "To prevent font-loading delays or text invisibility common in 3D WebGL applications, node labels and tech badges are rendered locally via <code>THREE.CanvasTexture</code> generated on HTML 2D canvas elements in 0ms.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Dual Theme Architecture (Serene Light vs Obsidian Dark):</b>", h2_style))
    story.append(Paragraph(
        "The design system supports real-time theme toggling across both the landing page and internal study workspace:",
        body_style
    ))

    theme_data = [
        [Paragraph("<b>Theme Attribute</b>", body_style), Paragraph("<b>Light Theme (Serene Paper Canvas)</b>", body_style), Paragraph("<b>Dark Theme (Obsidian Studio Slate)</b>", body_style)],
        [Paragraph("Primary Background", body_style), Paragraph("<code>#fafafa</code>", body_style), Paragraph("<code>#0b0c10</code>", body_style)],
        [Paragraph("Card Surface", body_style), Paragraph("<code>#ffffff</code>", body_style), Paragraph("<code>#14161f</code>", body_style)],
        [Paragraph("Primary Text", body_style), Paragraph("<code>#0f172a</code> (Slate 900)", body_style), Paragraph("<code>#f8fafc</code> (Slate 50)", body_style)],
        [Paragraph("Accent Gradient", body_style), Paragraph("Linear Indigo (<code>#6366f1</code>)", body_style), Paragraph("Violet/Purple Glow (<code>#8b5cf6</code>)", body_style)],
        [Paragraph("Typography", body_style), Paragraph("Outfit (Headings), DM Sans (Body)", body_style), Paragraph("JetBrains Mono (Data & Metrics)", body_style)]
    ]
    theme_table = Table(theme_data, colWidths=[120, 192, 192])
    theme_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(theme_table)

    story.append(PageBreak())

    # ==========================================
    # PAGE 6: CHALLENGES FACED & SOLUTIONS
    # ==========================================
    story.append(Paragraph("6. Technical Challenges & Engineering Solutions", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary, spaceAfter=10))

    c1 = "<b>Challenge 1: Drei &lt;Text&gt; Font Loading Failures in 3D WebGL</b><br/><i>Problem:</i> Drei's 3D Text component relied on external Google Fonts CDN fetches, causing text invisibility during offline/slow network states.<br/><i>Solution:</i> Implemented 100% local <code>THREE.CanvasTexture</code> sprites rendered dynamically on 2D HTML canvas elements."
    c2 = "<b>Challenge 2: Express 5 path-to-regexp Route Syntax Breaking CORS</b><br/><i>Problem:</i> Express 5 on Node v24 threw <code>PathError: Missing parameter name</code> on unescaped <code>app.options('*')</code> routes.<br/><i>Solution:</i> Implemented a dynamic CORS origin resolver in <code>server/src/index.js</code> that strips trailing slashes, permits <code>.vercel.app</code> origins, and handles OPTIONS preflights natively."
    c3 = "<b>Challenge 3: Generic Documentation Fallback Links</b><br/><i>Problem:</i> Early prototypes redirected all module documentation links to the generic MDN homepage.<br/><i>Solution:</i> Built <code>resolveDocUrl()</code>, a smart documentation router that maps technology keywords (React, Node.js, PostgreSQL, Redis, Python, Docker) to official documentation portals."
    c4 = "<b>Challenge 4: PDF Ingestion & Binary Memory Buffering</b><br/><i>Problem:</i> Processing large PDF files on serverless backends caused memory pressure.<br/><i>Solution:</i> Configured Multer memory storage with a strict 10MB limit and 15,000-character extraction cap using <code>pdf-parse</code>."

    for c in [c1, c2, c3, c4]:
        c_box = Table([[Paragraph(c, body_style)]], colWidths=[504])
        c_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 7)
        ]))
        story.append(c_box)
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Conclusion & Round 2 Submission Summary", h2_style))
    story.append(Paragraph(
        "NeuroNova represents a complete, production-ready AI personalized learning solution. Built with mathematical precision, clean design system architecture, sub-500ms compilation speed, and full 6-pillar feature completeness, NeuroNova transforms online learning into an engaging, structured, and achievable journey.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}!")

if __name__ == "__main__":
    build_pdf()
