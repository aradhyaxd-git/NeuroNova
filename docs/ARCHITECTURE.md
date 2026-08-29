# NeuroNova — System Architecture & Engineering Blueprint

NeuroNova is an AI-powered personalized learning platform that generates adaptive, multi-stage 3D skill trajectories, interactive practice studios, active recall flashcards, and explainability recommendations tailored to a learner's background, available time, and career objectives.

---

## 🏗️ High-Level System Architecture

```
                               ┌──────────────────────────────────────────┐
                               │             USER BROWSER                 │
                               │                                          │
                               │  ┌────────────────────────────────────┐  │
                               │  │   React 19 + Vite Frontend SPA     │  │
                               │  │  - 3D WebGL Canvas (Three.js/Fiber) │  │
                               │  │  - 12-Section Continuous Scroll    │  │
                               │  │  - Interactive Kanban & Studio     │  │
                               │  │  - Clerk Auth Modal & State        │  │
                               │  └──────────────────┬─────────────────┘  │
                               └─────────────────────┼────────────────────┘
                                                     │ HTTP REST / JSON
                                                     ▼
                               ┌──────────────────────────────────────────┐
                               │           EXPRESS BACKEND API            │
                               │                                          │
                               │  ┌────────────────────────────────────┐  │
                               │  │      Node.js Express API Server    │  │
                               │  │  - Multer PDF Ingestion Engine     │  │
                               │  │  - pdf-parse Text Extraction       │  │
                               │  │  - SQLite Database Persistence     │  │
                               │  └──────────────────┬─────────────────┘  │
                               └─────────────────────┼────────────────────┘
                                                     │
                                       ┌─────────────┴─────────────┐
                                       ▼                           ▼
                         ┌───────────────────────────┐ ┌───────────────────────────┐
                         │   Google Gemini 2.5 API   │ │   SQLite Local Database   │
                         │   - Structured JSON LLM   │ │   - User Profiles & Chat  │
                         │   - Active Recall Studio  │ │   - Roadmaps & Progress   │
                         └───────────────────────────┘ └───────────────────────────┘
```

---

## 🎨 3D WebGL Neural Engine & Landing Pipeline

The landing page features a **12-Section Continuous 3D Scroll Narrative** driven by `@react-three/fiber` and `@react-three/drei`:

1. **Polyhedral AI Knowledge Core (`Hero3DCanvas.jsx`)**:
   - Renders a multi-layered wireframe icosahedron and crystalline octahedron core with concentric laser orbit rings.
   - Rotates dynamically in sync with smooth scroll progress (`useScroll`).
2. **Local WebGL CanvasTexture Sprites**:
   - Generates high-DPI text and technology brand node sprites using `THREE.CanvasTexture` created dynamically on HTML 2D canvas elements.
   - Operates with zero CDN font dependencies, rendering instantaneously without blocking DOM elements.
3. **Real Technology Nodes**:
   - Represents real tech stack domains (JavaScript, TypeScript, React 19, Node.js, PostgreSQL, Redis, Python & AI, Docker & Infra) using official brand accent colors and connection lasers.

---

## 🧠 The 6 AI Engine Pillars

NeuroNova is architected around 6 core intelligence pillars:

| Pillar | Component | Description |
| :--- | :--- | :--- |
| **Pillar 1: Goal Synthesis** | `ConversationalIntake.jsx` | Natural language chat advisor that extracts career goals, weekly hours, experience level, and target outcomes into structured profile parameters. |
| **Pillar 2: Learner Profiling** | `LearnerProfileCard.jsx` | Cognitive parameter engine managing validated topic focus areas, weekly velocity, and skill benchmarks. |
| **Pillar 3: Path Generation** | `LearningPathRoadmap.jsx` | Multi-stage roadmap generator producing multi-view boards (Kanban, Sequential Timeline, Compact List). |
| **Pillar 4: Active Recall Studio** | `NotesStudyStudio.jsx` | PDF upload parser (`multer` + `pdf-parse`) generating 3D active recall flashcards, practice quizzes, and executive summaries. |
| **Pillar 5: AI Explainability** | `ExplainabilityModal.jsx` | Transparent recommendation rationale explaining *why* each node is recommended for the learner's goal, with topic-specific official doc links (`resolveDocUrl`). |
| **Pillar 6: Skill Trajectory** | `TrajectoryDashboard.jsx` | Momentum tracker visualizing real-time competency growth deltas (`+15% growth`) and next recommended actions. |

---

## 💾 Database Schema (SQLite)

Persistent state is stored in SQLite via `better-sqlite3` (`server/data/neuronova.db`):

- **`profiles`**: User ID, target goal, experience level, interests JSON, weekly hours, target outcome, updated timestamp.
- **`roadmaps`**: User ID, roadmap ID, title, summary, duration weeks, total milestones, stages JSON.
- **`module_progress`**: User ID, roadmap ID, module ID, status (`to_learn`, `in_progress`, `completed`, `mastered`), updated timestamp.
- **`chat_history`**: User ID, role (`user` | `assistant`), content string, timestamp.

---

## 🔒 Authentication & Theme Architecture

- **Authentication**: Powered by `@clerk/clerk-react` with instant modal sign-in/sign-up and interactive studio demo fallback (`sessionStorage.getItem('neuronova_demo')`).
- **Theme State**: Global dark/light theme state managed at root `App.jsx` level (`localStorage.getItem('neuronova_theme')`). Applies `.dark` class to root container, dynamically transforming colors between **Light Serene Canvas** (`#fafafa`) and **Dark Obsidian Slate** (`#0b0c10`).
