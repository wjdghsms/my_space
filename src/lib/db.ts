import Database from 'better-sqlite3';
import path from 'path';

// 데이터베이스 연결
const db = new Database(path.join(process.cwd(), 'todos.db'));

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
  )
`);

export default db; 