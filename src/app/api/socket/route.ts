import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { EVENTS } from '@/lib/socket';

// 전역 변수로 Socket.IO 서버 인스턴스 저장
let io: SocketIOServer | null = null;

export async function GET(req: NextRequest) {
  // Socket.IO 서버가 이미 초기화되어 있는지 확인
  if (!io) {
    // 서버 측 Socket.IO 설정은 Pages Router에서 더 쉽게 할 수 있지만,
    // App Router에서는 별도의 서버 설정이 필요합니다.
    // 여기서는 API 라우트를 통해 클라이언트에게 상태만 알려줍니다.
    console.log('Socket.IO server would be initialized in a full implementation');
  }
  
  return NextResponse.json({ socketInitialized: !!io });
}

// 모든 클라이언트에게 할 일 목록이 업데이트되었음을 알리는 함수
export function notifyTodoUpdated() {
  if (io) {
    io.emit(EVENTS.TODO_UPDATED);
  }
} 