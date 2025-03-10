import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로 설정
const dataFilePath = path.join(process.cwd(), 'data', 'todos.json');

// 디렉토리가 없으면 생성
const ensureDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 할 일 목록 불러오기
const getTodos = () => {
  ensureDirectoryExists();
  
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }
  
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to parse todos from file:', error);
    return [];
  }
};

// 할 일 목록 저장하기
const saveTodos = (todos: any[]) => {
  ensureDirectoryExists();
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
};

// GET 요청 처리 (할 일 목록 불러오기)
export async function GET() {
  try {
    const todos = getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 (할 일 목록 저장하기)
export async function POST(request: NextRequest) {
  try {
    const todos = await request.json();
    saveTodos(todos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving todos:', error);
    return NextResponse.json(
      { error: 'Failed to save todos' },
      { status: 500 }
    );
  }
} 