# NeuroNova — Getting Started & Local Development Guide

This guide will walk you through setting up, configuring, running, and testing the **NeuroNova AI** stack on your local environment.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher (Node `v20` recommended)
- **npm**: `v9.0.0` or higher
- **Git**: For repository version control

---

## 🚀 Quick Setup Guide

### 1. Clone Repository & Install Dependencies

Clone the project repository and install dependencies for both `client` and `server`:

```bash
# Clone the repository
git clone https://github.com/aradhyaxd/NeuroNova.git
cd NeuroNova

# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
```

---

## 🔑 Environment Variables Configuration

### Server Configuration (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> 💡 **Note**: If `GEMINI_API_KEY` is omitted, the server operates in deterministic fallback mode, allowing offline development and testing.

---

### Client Configuration (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

---

## 🏃 Running Local Development Servers

Start the server and client concurrently in two terminal windows:

### Terminal 1: Express Backend Server
```bash
cd server
npm start
```
*Backend server runs at `http://localhost:5000` with SQLite DB initialization at `server/data/neuronova.db`.*

### Terminal 2: Vite React Frontend
```bash
cd client
npm run dev
```
*Frontend dev server runs at `http://localhost:5173`.*

---

## 🧪 Production Build & Verification

To test production compilation:

```bash
# Test Client Production Build
cd client
npm run build
```

This compiles client assets into `client/dist/` in under **500ms** with 0 bundle or type errors.

---

## 📑 Feature Testing Checklist

1. **3D Landing Page Scroll**:
   - Open `http://localhost:5173/` and scroll down to test the 12-section continuous 3D WebGL narrative.
2. **Interactive Studio Demo**:
   - Click **Explore Interactive Studio Demo** to launch the studio workspace without signing in.
3. **PDF Active Recall Upload**:
   - Navigate to **Practice Studio & Flashcards**, click **Upload PDF Document**, and select any PDF file to test the `multer` + `pdf-parse` extraction pipeline.
4. **Theme Toggle**:
   - Click the sun/moon icon in the floating navbar or sidebar dock to toggle between Light Serene Canvas and Dark Obsidian Slate.
