import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MemoryDbFallback {
  constructor() {
    this.profiles = new Map();
    this.roadmaps = new Map();
    this.progress = new Map();
    this.chat = [];
  }

  prepare(sql) {
    const text = sql.trim().toLowerCase();

    if (text.includes('select * from profiles')) {
      return {
        get: (userId) => this.profiles.get(userId) || null
      };
    }

    if (text.includes('select * from roadmaps')) {
      return {
        get: (userId) => this.roadmaps.get(userId) || null
      };
    }

    if (text.includes('select module_id, status from module_progress')) {
      return {
        all: (userId) => Array.from(this.progress.values()).filter(p => p.userId === userId)
      };
    }

    if (text.includes('select role, content from chat_history')) {
      return {
        all: (userId) => this.chat.filter(c => c.userId === userId)
      };
    }

    if (text.includes('insert into profiles')) {
      return {
        run: (id, userId, goal, level, interests, hours, outcome) => {
          this.profiles.set(userId, {
            id, user_id: userId, goal, experience_level: level, interests, weekly_hours: hours, target_outcome: outcome, updated_at: new Date().toISOString()
          });
        }
      };
    }

    if (text.includes('insert into roadmaps')) {
      return {
        run: (id, userId, title, summary, weeks, milestones, stagesJson) => {
          this.roadmaps.set(userId, {
            id, user_id: userId, title, summary, target_duration_weeks: weeks, total_milestones: milestones, stages_json: stagesJson, created_at: new Date().toISOString()
          });
        }
      };
    }

    if (text.includes('insert into module_progress')) {
      return {
        run: (userId, roadmapId, moduleId, status) => {
          const key = `${userId}_${roadmapId}_${moduleId}`;
          this.progress.set(key, { userId, roadmap_id: roadmapId, module_id: moduleId, status });
        }
      };
    }

    if (text.includes('insert into chat_history')) {
      return {
        run: (userId, role, content) => {
          this.chat.push({ userId, role, content });
        }
      };
    }

    return { get: () => null, all: () => [], run: () => {} };
  }

  pragma() {}
  exec() {}
}

let dbInstance;

async function createDatabase() {
  try {
    const DatabaseModule = await import('better-sqlite3');
    const Database = DatabaseModule.default || DatabaseModule;
    
    const possiblePaths = [
      path.join(__dirname, '../data/neuronova.db'),
      '/tmp/neuronova.db'
    ];

    for (const dbPath of possiblePaths) {
      try {
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const instance = new Database(dbPath);
        try { instance.pragma('journal_mode = WAL'); } catch (e) {}

        instance.exec(`
          CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY, user_id TEXT DEFAULT 'default_user', goal TEXT,
            experience_level TEXT, interests TEXT, weekly_hours INTEGER, target_outcome TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY, user_id TEXT DEFAULT 'default_user', title TEXT,
            summary TEXT, target_duration_weeks INTEGER, total_milestones INTEGER, stages_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS module_progress (
            user_id TEXT DEFAULT 'default_user', roadmap_id TEXT, module_id TEXT, status TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, roadmap_id, module_id)
          );
          CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT DEFAULT 'default_user', role TEXT, content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        console.log(`SQLite database successfully loaded at: ${dbPath}`);
        return instance;
      } catch (err) {
        console.warn(`Could not open SQLite at ${dbPath}:`, err.message);
      }
    }
  } catch (err) {
    console.warn("better-sqlite3 native module unavailable on host environment. Using memory fallback:", err.message);
  }

  return new MemoryDbFallback();
}

dbInstance = await createDatabase();

export default dbInstance;
