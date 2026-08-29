# NeuroNova AI — Intelligent Personalized Learning Studio

<p align="center">
  <img src="client/src/assets/logo.png" width="96" height="96" alt="NeuroNova 3D Logo" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>An Intelligent 3D Learning Universe, Adaptive Skill Trajectory Engine & Active Recall Studio</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture--tech-stack">Architecture</a> •
  <a href="#-quickstart-guide">Quickstart</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-license">License</a>
</p>

---

## 🌟 Executive Overview

**NeuroNova** turns your goals, current experience level, and available weekly study time into an intelligent, adaptive learning path. Powered by **Google Gemini 2.5**, **WebGL 3D Neural Engines**, and **SQLite Data Persistence**, NeuroNova eliminates the paralysis of figuring out *what to learn next*.

---

## 🚀 Key Features

### 🌌 1. 12-Section Continuous 3D Scroll Narrative Page
- **WebGL Neural Core (`Hero3DCanvas.jsx`)**: Multi-layered wireframe polyhedral geometry and crystalline octahedron core with concentric laser orbit rings.
- **Real Technology Nodes**: Interactive 3D textures representing real tech stack domains (**JavaScript**, **TypeScript**, **React 19**, **Node.js**, **PostgreSQL**, **Redis**, **Python & AI**, **Docker & Infra**) with official brand colors.
- **Local WebGL CanvasTexture Sprites**: Instant, zero-CDN font rendering powered by high-DPI HTML canvas textures.

### 📋 2. Multi-View Path Roadmap Board
- **Kanban Board View**: Jira-inspired columns (`TO LEARN`, `IN PROGRESS`, `MASTERED`) with card status toggling.
- **Sequential Timeline View**: Stage blocks with numbered gradient markers and inline why-recommended expanders.
- **Compact List View**: Structured 5-column table displaying module titles, types, estimated hours, and actions.

### 📑 3. PDF Active Recall & Practice Studio
- **PDF File Ingestion**: Ingests uploaded PDF documents up to 10MB using `multer` and `pdf-parse`.
- **3D Active Recall Flashcards**: Interactive 3D flip card deck with keyboard navigation (`Space` to flip, `←`/`→` to navigate).
- **Practice Quizzes & Summaries**: AI-generated multiple-choice practice quizzes with explanations.

### 💡 4. AI Explainability & Documentation Router
- **Recommendation Rationale**: Transparent explanation detailing *why* each node is recommended for your specific goal.
- **Dynamic Documentation Link Router (`resolveDocUrl`)**: Direct links to official technology documentation (**React.dev**, **Nodejs.org**, **PostgreSQL.org**, **Redis.io**, **TypeScriptlang.org**, **Docs.python.org**, **Platform.openai.com**, **Docker.com**) instead of generic home redirects.

### 📊 5. Learner Intelligence Profiling & Skill Trajectory
- **Learner Intelligence Profile**: Structured cognitive parameters engine managing experience level, weekly commitment, and focus areas.
- **Skill Development Deltas**: Real-time momentum metrics visualizing competency growth deltas (`+15% growth`).

### 🌓 6. Real-Time Dual Theme Engine
- **Light Serene Canvas** (`#fafafa`) and **Dark Obsidian Slate** (`#0b0c10`) with real-time theme toggling across both the landing page and internal study workspace.

---

## 🏗 Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                        FRONTEND                             │
   │  React 19 • Vite • Three.js (@react-three/fiber) • Framer   │
   │  Simple Icons • Clerk Auth • Local Storage Sync            │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTP REST API
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                        BACKEND                              │
   │  Node.js • Express • Multer Memory Upload • pdf-parse       │
   │  Better-SQLite3 Persistence • Google Gemini 2.5 SDK         │
   └─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
NeuroNova/
├── client/                     # Vite + React 19 Frontend
│   ├── src/
│   │   ├── assets/             # Brand 3D logo images & SVGs
│   │   ├── components/
│   │   │   ├── landing/        # 12-section 3D continuous scroll components
│   │   │   ├── overview/       # Dashboard Overview & active focus cards
│   │   │   ├── roadmap/        # Path Roadmap Board (Kanban/Timeline/List)
│   │   │   ├── studio/         # Practice Studio & PDF flashcard deck
│   │   │   ├── profile/        # Learner Intelligence Profile card
│   │   │   └── dashboard/      # Skill Trajectory Dashboard & deltas
│   │   ├── styles.css          # Design system & theme CSS rules
│   │   └── App.jsx             # Main app shell & theme state container
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── index.js            # REST API endpoints & Gemini integration
│   │   └── db.js               # SQLite database setup & migrations
│   ├── data/                   # SQLite database persistent storage
│   └── package.json
│
└── docs/                       # Project Developer Documentation
    ├── ARCHITECTURE.md         # System Architecture & WebGL 3D Pipeline
    ├── API.md                  # Complete REST API Specification
    ├── GETTING_STARTED.md      # Setup, Environment Variables & Dev Guide
    └── DESIGN_SYSTEM.md        # Theme palette & typography design system
```

---

## ⚡ Quickstart Guide

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

**Server (`server/.env`)**:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

**Client (`client/.env`)**:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### 3. Run Local Servers

```bash
# Terminal 1: Start Express Backend
cd server
npm start

# Terminal 2: Start Vite Frontend
cd client
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 📚 Complete Developer Documentation

For deeper technical guides, inspect the `docs/` folder:

- 📑 [System Architecture & 3D Engine Blueprint](docs/ARCHITECTURE.md)
- 🔌 [Complete REST API Specification](docs/API.md)
- 🚀 [Local Setup & Development Guide](docs/GETTING_STARTED.md)
- 🎨 [Design System & Theme Specifications](docs/DESIGN_SYSTEM.md)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.