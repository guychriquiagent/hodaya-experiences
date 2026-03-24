import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Request {
  id: string;
  name: string;
  email: string;
  date: string;
  experience: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: Comment[];
  createdAt: string;
}

export interface DB {
  requests: Request[];
}

export function readDB(): DB {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
