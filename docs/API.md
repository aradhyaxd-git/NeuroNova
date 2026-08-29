# NeuroNova — API Specification & Endpoint Documentation

The NeuroNova backend is an Express REST API running on port `5000` (configurable via `PORT`). It interfaces with SQLite for data persistence and Google Gemini 2.5 (`@google/genai`) for structured JSON generation.

---

## 🛠️ API Endpoints Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/health` | `GET` | Health check endpoint returning backend status and Gemini API key configuration state. |
| `GET /api/user-data` | `GET` | Fetches persistent profile, active roadmap, completed module progress, and chat history for a user. |
| `POST /api/upload-pdf` | `POST` | Parses uploaded PDF documents (up to 10MB) and generates 3D active recall flashcards & quizzes. |
| `POST /api/chat-intake` | `POST` | Conversational intake chat advisor that extracts structured learner profiles. |
| `POST /api/roadmap` | `POST` | Generates a 3-stage structured learning roadmap based on learner profile parameters. |
| `POST /api/module-progress` | `POST` | Syncs module status updates (`to_learn`, `in_progress`, `completed`) to SQLite DB. |
| `POST /api/explain-module` | `POST` | Handles AI mentor follow-up questions regarding specific module recommendations. |
| `POST /api/study-set` | `POST` | Converts raw text notes into active recall flashcards, quiz questions, and summaries. |

---

## 📑 Detailed Endpoint Documentation

### 1. Health Check
`GET /api/health`

**Response (`200 OK`)**:
```json
{
  "status": "ok",
  "hasGemini": true,
  "hasDb": true
}
```

---

### 2. User Data Ingestion
`GET /api/user-data?userId=default_user`

**Response (`200 OK`)**:
```json
{
  "profile": {
    "goal": "Master Full-Stack Engineering & AI Applications",
    "experienceLevel": "Intermediate",
    "interests": ["React", "Node.js", "System Design"],
    "weeklyHours": 6,
    "targetOutcome": "Senior AI Engineer"
  },
  "roadmap": {
    "id": "path_1787995000",
    "title": "Full-Stack AI Engineering Masterclass",
    "targetDurationWeeks": 4,
    "totalMilestones": 4,
    "stages": []
  },
  "completedModules": ["mod_101"],
  "messages": []
}
```

---

### 3. PDF Ingestion & Active Recall Generator
`POST /api/upload-pdf`  
`Content-Type: multipart/form-data`

**Form Body**:
- `file`: PDF File Buffer (max 10MB)

**Response (`200 OK`)**:
```json
{
  "fileName": "system_design_lecture.pdf",
  "summary": "Extracted 12 pages covering microservices, caching strategies, and event-driven architecture.",
  "difficulty": "Intermediate",
  "flashcards": [
    {
      "question": "What is the primary trade-off of write-through caching?",
      "answer": "Write latency increases on write operations, but read operations guarantee consistency."
    }
  ],
  "quiz": [
    {
      "question": "Which database type is best suited for graph queries?",
      "options": ["Relational DB", "Graph DB (Neo4j)", "Key-Value Store", "Document Store"],
      "correctAnswer": 1,
      "explanation": "Graph databases optimize for node-edge relationship traversals."
    }
  ]
}
```

---

### 4. Conversational Intake Chat
`POST /api/chat-intake`  
`Content-Type: application/json`

**Request Body**:
```json
{
  "userId": "usr_123",
  "currentProfile": {
    "goal": "Learn React and Node.js",
    "experienceLevel": "Beginner",
    "weeklyHours": 5
  },
  "messages": [
    { "role": "user", "content": "I want to become a full stack developer focusing on React and AI." }
  ]
}
```

**Response (`200 OK`)**:
```json
{
  "reply": "That's a fantastic career objective! Focusing on React alongside AI integration will allow you to build interactive intelligent products.",
  "extractedProfile": {
    "goal": "Master Full-Stack React & AI Integration",
    "experienceLevel": "Intermediate",
    "interests": ["React", "AI Integration", "Node.js"],
    "weeklyHours": 6,
    "targetOutcome": "Full-Stack AI Developer"
  }
}
```

---

### 5. Learning Roadmap Generator
`POST /api/roadmap`  
`Content-Type: application/json`

**Request Body**:
```json
{
  "userId": "usr_123",
  "profile": {
    "goal": "Master System Design",
    "experienceLevel": "Intermediate",
    "interests": ["PostgreSQL", "Redis", "Distributed Systems"],
    "weeklyHours": 6
  }
}
```

**Response (`200 OK`)**:
```json
{
  "id": "path_1787998000",
  "title": "System Design Masterclass Path",
  "summary": "A 4-week roadmap focused on PostgreSQL, Redis, and Distributed Systems.",
  "targetDurationWeeks": 4,
  "totalMilestones": 4,
  "stages": [
    {
      "id": "stage_1",
      "title": "Stage 1: Core Architecture & Data Persistence",
      "description": "Establish fundamental database and caching mechanisms.",
      "modules": [
        {
          "id": "mod_101",
          "title": "PostgreSQL Indexing & Query Optimization",
          "type": "concept",
          "status": "in_progress",
          "estimatedHours": 4,
          "prerequisites": [],
          "explainability": {
            "topReason": "Crucial foundation for low-latency relational data querying.",
            "detailedWhy": "Indexing strategies directly dictate query execution plans in production.",
            "skillGains": ["SQL Indexing", "Query Analysis"]
          },
          "resources": [
            {
              "title": "PostgreSQL Official Documentation",
              "type": "Documentation",
              "duration": "30 mins",
              "url": "https://www.postgresql.org/docs/"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 6. Module Progress Sync
`POST /api/module-progress`  
`Content-Type: application/json`

**Request Body**:
```json
{
  "userId": "usr_123",
  "roadmapId": "path_1787998000",
  "moduleId": "mod_101",
  "status": "completed"
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "moduleId": "mod_101",
  "status": "completed"
}
```
