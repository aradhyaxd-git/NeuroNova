import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';
import db from './db.js';

const require = createRequire(import.meta.url);
const pdfPkg = require('pdf-parse');

async function parsePdfBuffer(buffer) {
  try {
    if (typeof pdfPkg === 'function') {
      return await pdfPkg(buffer);
    }
    if (pdfPkg.PDFParse) {
      const instance = new pdfPkg.PDFParse({ data: buffer });
      await instance.load();
      const result = await instance.getText();
      return {
        text: result.text || '',
        numpages: result.total || result.pages?.length || 1
      };
    }
  } catch (e) {
    console.warn('pdf-parse extraction warning:', e.message);
  }
  return { text: buffer.toString('utf8', 0, Math.min(buffer.length, 10000)), numpages: 1 };
}

const app = express();
const port = process.env.PORT || 5000;
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const gemini = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Dynamic, Production-Resilient CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedList = (process.env.CLIENT_ORIGIN || '*')
      .split(',')
      .map(o => o.trim().replace(/\/$/, ''));

    const cleanOrigin = origin.replace(/\/$/, '');

    if (
      allowedList.includes('*') ||
      allowedList.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Multer memory upload configuration (10MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json({ limit: '10mb' }));

const cleanJson = (text) => text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'NeuroNova API Service' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', hasGemini: !!gemini, hasDb: true }));

// Load all persistent user data from SQLite DB
app.get('/api/user-data', (req, res) => {
  const userId = req.query.userId || 'default_user';
  try {
    const profileRow = db.prepare('SELECT * FROM profiles WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1').get(userId);
    const roadmapRow = db.prepare('SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
    const progressRows = db.prepare('SELECT module_id, status FROM module_progress WHERE user_id = ?').all(userId);
    const chatRows = db.prepare('SELECT role, content FROM chat_history WHERE user_id = ? ORDER BY id ASC').all(userId);

    const profile = profileRow ? {
      goal: profileRow.goal,
      experienceLevel: profileRow.experience_level,
      interests: JSON.parse(profileRow.interests || '[]'),
      weeklyHours: profileRow.weekly_hours,
      targetOutcome: profileRow.target_outcome
    } : null;

    const roadmap = roadmapRow ? {
      id: roadmapRow.id,
      title: roadmapRow.title,
      summary: roadmapRow.summary,
      targetDurationWeeks: roadmapRow.target_duration_weeks,
      totalMilestones: roadmapRow.total_milestones,
      stages: JSON.parse(roadmapRow.stages_json || '[]')
    } : null;

    const completedModules = progressRows.filter(p => p.status === 'completed' || p.status === 'mastered').map(p => p.module_id);

    res.json({
      profile,
      roadmap,
      completedModules,
      messages: chatRows.length > 0 ? chatRows : null
    });
  } catch (err) {
    console.error('Error loading user data:', err.message);
    res.status(500).json({ error: 'Failed to load user data from database.' });
  }
});

// 1. PDF Upload & Active Recall Generator Endpoint
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Uploaded file must be a PDF document.' });
  }

  try {
    const pdfData = await parsePdfBuffer(req.file.buffer);
    const extractedText = pdfData.text ? pdfData.text.trim() : '';

    if (extractedText.length < 20) {
      return res.status(400).json({ error: 'Could not extract sufficient text from this PDF file.' });
    }

    const truncatedNotes = extractedText.slice(0, 15000);

    let studySet = {
      fileName: req.file.originalname,
      summary: `Extracted ${pdfData.numpages || 1} pages from ${req.file.originalname}. Key focus: ` + truncatedNotes.slice(0, 80) + '...',
      difficulty: 'Intermediate',
      flashcards: [
        { question: "What is the primary topic of the uploaded PDF?", answer: truncatedNotes.slice(0, 120) + "..." },
        { question: "How many pages were parsed?", answer: `${pdfData.numpages || 1} pages successfully parsed from ${req.file.originalname}.` }
      ],
      quiz: [
        { question: "Which statement best describes the uploaded document?", options: ["Presents structured technical/study concepts", "Empty file", "Unrelated notes", "General index"], correctAnswer: 0, explanation: "Parsed successfully from uploaded PDF material." }
      ]
    };

    if (gemini) {
      try {
        const prompt = `You are an expert study coach. Parse the following text extracted from a PDF document named "${req.file.originalname}" into a high-quality study set.
Return ONLY valid JSON in this exact schema:
{
  "summary": "concise 2-3 sentence overview",
  "difficulty": "Beginner|Intermediate|Advanced",
  "flashcards": [{"question": "...", "answer": "..."}],
  "quiz": [{"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": 0, "explanation": "..."}]
}
Create 5-8 flashcards and 3-4 quiz questions. Text:\n\n${truncatedNotes}`;

        const result = await gemini.models.generateContent({
          model: geminiModel,
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.35 }
        });

        const parsed = JSON.parse(cleanJson(result.text || '{}'));
        if (parsed.flashcards) studySet = { ...parsed, fileName: req.file.originalname };
      } catch (gemErr) {
        console.error('Gemini PDF study generation error:', gemErr.message);
      }
    }

    res.json(studySet);
  } catch (err) {
    console.error('PDF parse error:', err.message);
    res.status(500).json({ error: 'Failed to process PDF file. Ensure it is not password protected.' });
  }
});

// 2. Conversational Intake Endpoint
app.post('/api/chat-intake', async (req, res) => {
  const { messages = [], currentProfile = {}, userId = 'default_user' } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Please send at least one message.' });
  }

  let reply = "I'd love to help you build your personalized learning path! What specific goal or skill are you aiming to master?";
  let extractedProfile = {
    goal: currentProfile.goal || "Master Full-Stack Web Development & AI Integration",
    experienceLevel: currentProfile.experienceLevel || "Intermediate",
    interests: currentProfile.interests || ["React", "Node.js", "AI Applications"],
    weeklyHours: currentProfile.weeklyHours || 6
  };

  if (gemini) {
    try {
      const prompt = `You are NeuroNova, an elite AI Personalized Learning Path Advisor. 
The learner is describing their goals, interests, current experience, and available study time.

Current Profile: ${JSON.stringify(currentProfile)}

Chat History:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

Respond in valid JSON with two fields:
1. "reply": A warm, encouraging, intelligent 2-3 sentence response guiding the conversation.
2. "extractedProfile": Updated learner profile object with keys: "goal", "experienceLevel", "interests" (array), "weeklyHours" (integer), "targetOutcome".

Return ONLY raw JSON, no markdown wrappers.`;

      const result = await gemini.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.4 }
      });

      const parsed = JSON.parse(cleanJson(result.text || '{}'));
      if (parsed.reply) reply = parsed.reply;
      if (parsed.extractedProfile) extractedProfile = parsed.extractedProfile;
    } catch (error) {
      console.error('Chat intake Gemini error:', error.message);
    }
  }

  // Persist Profile & Chat to SQLite DB
  try {
    const profId = 'prof_' + Date.now();
    db.prepare(`
      INSERT INTO profiles (id, user_id, goal, experience_level, interests, weekly_hours, target_outcome)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      profId,
      userId,
      extractedProfile.goal || '',
      extractedProfile.experienceLevel || 'Intermediate',
      JSON.stringify(extractedProfile.interests || []),
      extractedProfile.weeklyHours || 6,
      extractedProfile.targetOutcome || ''
    );

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      db.prepare('INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)').run(userId, 'user', lastUserMsg.content);
    }
    db.prepare('INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)').run(userId, 'assistant', reply);
  } catch (dbErr) {
    console.error('DB save error:', dbErr.message);
  }

  res.json({ reply, extractedProfile });
});

// 3. Structured Learning Path Roadmap Generator Endpoint
app.post('/api/roadmap', async (req, res) => {
  const { profile = {}, userId = 'default_user' } = req.body;
  const goal = profile.goal || 'Full-Stack Developer';
  const level = profile.experienceLevel || 'Intermediate';
  const interests = (profile.interests || ['Web Development']).join(', ');
  const hours = profile.weeklyHours || 6;

  let roadmapData = {
    id: "path_" + Date.now(),
    title: `${goal} Masterclass Path`,
    summary: `A tailored ${level.toLowerCase()}-level roadmap focused on ${interests}, designed for ${hours} hours/week.`,
    targetDurationWeeks: Math.max(4, Math.ceil(24 / hours)),
    totalMilestones: 4,
    stages: [
      {
        id: "stage_1",
        title: "Stage 1: Core Foundations & Architecture",
        description: "Establish strong fundamental principles and environment setup.",
        modules: [
          {
            id: "mod_101",
            title: "Modern Ecosystem Fundamentals",
            type: "concept",
            status: "completed",
            estimatedHours: 4,
            prerequisites: [],
            explainability: {
              topReason: `Essential starting block for ${level} learners targeting ${goal}.`,
              detailedWhy: `Fills foundational gaps in architectural design, speeding up later execution.`,
              skillGains: ["Architecture Basics", "Tooling Setup"]
            },
            resources: [
              { title: "JavaScript Language Fundamentals", type: "article", duration: "30 mins", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
              { title: "React 19 Official Documentation & Quickstart", type: "lab", duration: "1.5 hrs", url: "https://react.dev/learn" }
            ]
          },
          {
            id: "mod_102",
            title: "Core Mechanics & State Flow",
            type: "course",
            status: "in_progress",
            estimatedHours: 6,
            prerequisites: ["mod_101"],
            explainability: {
              topReason: "Teaches mandatory data flow mechanics required for production applications.",
              detailedWhy: "Directly addresses your objective to master clean code patterns.",
              skillGains: ["State Management", "Data Flow"]
            },
            resources: [
              { title: "React Managing State Documentation", type: "guide", duration: "45 mins", url: "https://react.dev/learn/managing-state" },
              { title: "Node.js Architecture & Event Loop API", type: "article", duration: "2 hrs", url: "https://nodejs.org/docs/latest/api/" }
            ]
          }
        ]
      },
      {
        id: "stage_2",
        title: "Stage 2: Practical Implementation & AI Integration",
        description: "Apply concepts to build real-world components and LLM services.",
        modules: [
          {
            id: "mod_201",
            title: "API Design & AI Service Orchestration",
            type: "course",
            status: "locked",
            estimatedHours: 8,
            prerequisites: ["mod_102"],
            explainability: {
              topReason: "Connects your local frontend logic with intelligent LLM backends.",
              detailedWhy: "Fulfills your interest in AI integration and API orchestration.",
              skillGains: ["API Integration", "LLM Orchestration"]
            },
            resources: [
              { title: "Node.js Express API Reference", type: "course", duration: "3 hrs", url: "https://nodejs.org/docs/latest/api/" },
              { title: "OpenAI & Gemini API Reference Docs", type: "guide", duration: "2 hrs", url: "https://platform.openai.com/docs/" }
            ]
          },
          {
            id: "mod_202",
            title: "Capstone Project: Production App Build",
            type: "project",
            status: "locked",
            estimatedHours: 12,
            prerequisites: ["mod_201"],
            explainability: {
              topReason: "Synthesizes all acquired skills into a portfolio-worthy capstone project.",
              detailedWhy: "Validates your real-world capability before advanced deployment.",
              skillGains: ["Full-Stack Deployment", "System Testing"]
            },
            resources: [
              { title: "System Design & Architecture Roadmap", type: "project", duration: "5 hrs", url: "https://roadmap.sh/system-design" }
            ]
          }
        ]
      }
    ]
  };

  if (gemini) {
    try {
      const prompt = `You are NeuroNova, an expert AI Curriculum Architect.
Generate a structured, highly personalized learning path roadmap for a learner with this profile:
- Goal: ${goal}
- Experience Level: ${level}
- Target Topics/Interests: ${interests}
- Time Commitment: ${hours} hours per week

Create 3 sequential Stages. Each stage must contain 2-3 Modules (total 6-8 modules).
Each module MUST have: "id", "title", "type", "status", "estimatedHours", "prerequisites", "explainability", "resources".
For resources, provide REAL official documentation URLs (e.g. https://react.dev/learn for React, https://nodejs.org/docs/latest/api/ for Node.js, https://www.postgresql.org/docs/ for PostgreSQL, https://docs.python.org/3/ for Python, https://platform.openai.com/docs/ for AI/LLM).

Return ONLY valid JSON matching this schema:
{
  "id": "path_...",
  "title": "...",
  "summary": "...",
  "targetDurationWeeks": number,
  "totalMilestones": number,
  "stages": [
    {
      "id": "stage_1",
      "title": "...",
      "description": "...",
      "modules": [...]
    }
  ]
}`;

      const result = await gemini.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.35 }
      });

      const parsed = JSON.parse(cleanJson(result.text || '{}'));
      if (parsed.stages) roadmapData = parsed;
    } catch (error) {
      console.error('Roadmap generation error:', error.message);
    }
  }

  // Save Roadmap to SQLite DB
  try {
    db.prepare(`
      INSERT INTO roadmaps (id, user_id, title, summary, target_duration_weeks, total_milestones, stages_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      roadmapData.id,
      userId,
      roadmapData.title || '',
      roadmapData.summary || '',
      roadmapData.targetDurationWeeks || 4,
      roadmapData.totalMilestones || 4,
      JSON.stringify(roadmapData.stages || [])
    );
  } catch (dbErr) {
    console.error('Roadmap DB save error:', dbErr.message);
  }

  res.json(roadmapData);
});

// Update Module Status in SQLite DB
app.post('/api/module-progress', (req, res) => {
  const { userId = 'default_user', roadmapId, moduleId, status } = req.body;
  if (!moduleId || !status) return res.status(400).json({ error: 'Missing moduleId or status.' });

  try {
    db.prepare(`
      INSERT INTO module_progress (user_id, roadmap_id, module_id, status, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, roadmap_id, module_id) DO UPDATE SET status = excluded.status, updated_at = CURRENT_TIMESTAMP
    `).run(userId, roadmapId || 'default', moduleId, status);

    res.json({ success: true, moduleId, status });
  } catch (err) {
    console.error('Module progress save error:', err.message);
    res.status(500).json({ error: 'Failed to update module status in database.' });
  }
});

// 4. AI Question & Answer Endpoint for Explainability Follow-ups
app.post('/api/explain-module', async (req, res) => {
  const { moduleTitle, userQuestion, learnerGoal } = req.body;
  if (!moduleTitle || !userQuestion) {
    return res.status(400).json({ error: 'Missing moduleTitle or userQuestion.' });
  }

  if (!gemini) {
    return res.json({
      answer: `Great question regarding "${moduleTitle}"! This module directly bridges basic theory to applied implementation. By mastering it, you'll feel confident tackling complex real-world scenarios in ${learnerGoal || 'your target field'}.`
    });
  }

  try {
    const prompt = `You are NeuroNova, an AI Learning Mentor. 
The learner is asking a follow-up question about a recommended module in their learning path.
Module: "${moduleTitle}"
Learner Goal: "${learnerGoal || 'General Mastery'}"
Question: "${userQuestion}"

Provide a clear, encouraging, expert answer (2-4 paragraphs) explaining how this fits into their learning path, key concepts to focus on, and how to conquer it effectively.`;

    const result = await gemini.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: { temperature: 0.4 }
    });

    res.json({ answer: result.text.trim() });
  } catch (error) {
    console.error('Explain module error:', error.message);
    res.status(500).json({ error: 'Failed to answer explainability question.' });
  }
});

// 5. Study Set Generation Endpoint (Text Source)
app.post('/api/study-set', async (req, res) => {
  const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() : '';
  if (notes.length < 15) return res.status(400).json({ error: 'Please provide at least 15 characters of material.' });
  if (notes.length > 18000) return res.status(400).json({ error: 'Please keep notes under 18,000 characters.' });

  if (!gemini) {
    return res.json({
      summary: "Study set generated for: " + notes.slice(0, 40) + "...",
      difficulty: "Intermediate",
      flashcards: [
        { question: "What is the primary objective of this module?", answer: "To establish fundamental mastery and practical application." },
        { question: "How does progress tracking function?", answer: "By monitoring completed milestones and skill deltas over time." }
      ],
      quiz: [
        { question: "Which strategy optimizes retention best?", options: ["Active recall & spaced practice", "Passive re-reading", "Cramming once", "Skipping prerequisites"], correctAnswer: 0, explanation: "Active recall with spaced repetition is scientifically proven to build long-term retention." }
      ]
    });
  }

  try {
    const prompt = `You are an expert study coach. Convert the supplied notes into a concise, accurate study set. Return ONLY valid JSON in exactly this schema: {"flashcards":[{"question":"...","answer":"..."}],"quiz":[{"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"..."}],"summary":"...","difficulty":"Beginner|Intermediate|Advanced"}. Create 4-8 flashcards and 3-5 multiple-choice questions. Notes:\n\n${notes}`;
    const result = await gemini.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.35 },
    });
    const parsed = JSON.parse(cleanJson(result.text || ''));
    res.json(parsed);
  } catch (error) {
    console.error('Study generation failed:', error.message);
    res.status(500).json({ error: 'Could not generate study set.' });
  }
});

// Global Error Handling & 404 Fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

if (!process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => console.log(`NeuroNova API running on 0.0.0.0:${port} with Multer & PDF Parser enabled`));
}

export default app;
