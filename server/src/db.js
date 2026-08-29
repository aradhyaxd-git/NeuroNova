import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'neuronova.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
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

export default db;
