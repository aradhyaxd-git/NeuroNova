import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function initDb() {
  const possiblePaths = [
    path.join(__dirname, '../data/neuronova.db'),
    '/tmp/neuronova.db'
  ];

  for (const dbPath of possiblePaths) {
    try {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const instance = new Database(dbPath);
      try {
        instance.pragma('journal_mode = WAL');
      } catch (e) {
        console.warn('SQLite WAL mode notice:', e.message);
      }

      instance.exec(`
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          user_id TEXT DEFAULT 'default_user',
          goal TEXT,
          experience_level TEXT,
          interests TEXT,
          weekly_hours INTEGER,
          target_outcome TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS roadmaps (
          id TEXT PRIMARY KEY,
          user_id TEXT DEFAULT 'default_user',
          title TEXT,
          summary TEXT,
          target_duration_weeks INTEGER,
          total_milestones INTEGER,
          stages_json TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS module_progress (
          user_id TEXT DEFAULT 'default_user',
          roadmap_id TEXT,
          module_id TEXT,
          status TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, roadmap_id, module_id)
        );

        CREATE TABLE IF NOT EXISTS chat_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT DEFAULT 'default_user',
          role TEXT,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log(`SQLite database successfully initialized at: ${dbPath}`);
      return instance;
    } catch (err) {
      console.warn(`Failed to initialize SQLite at ${dbPath}:`, err.message);
    }
  }

  console.warn("Using in-memory SQLite fallback DB.");
  const memInstance = new Database(':memory:');
  memInstance.exec(`
    CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, user_id TEXT, goal TEXT, experience_level TEXT, interests TEXT, weekly_hours INTEGER, target_outcome TEXT, updated_at TIMESTAMP);
    CREATE TABLE IF NOT EXISTS roadmaps (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, summary TEXT, target_duration_weeks INTEGER, total_milestones INTEGER, stages_json TEXT, created_at TIMESTAMP);
    CREATE TABLE IF NOT EXISTS module_progress (user_id TEXT, roadmap_id TEXT, module_id TEXT, status TEXT, updated_at TIMESTAMP, PRIMARY KEY (user_id, roadmap_id, module_id));
    CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, role TEXT, content TEXT, created_at TIMESTAMP);
  `);
  return memInstance;
}

const db = initDb();

export default db;
