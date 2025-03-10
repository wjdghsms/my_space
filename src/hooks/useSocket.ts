import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EVENTS } from '@/lib/socket';

// Socket.IO 클라이언트 인스턴스를 저장할 변수
let socket: Socket | null = null;

export function useSocket(onTodoUpdated: () => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 소켓이 아직 초기화되지 않았다면 초기화
    if (!socket) {
      // 개발 환경에서는 localhost:3000, 프로덕션 환경에서는 현재 호스트 사용
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3000';
      
      socket = io(socketUrl, {
        path: '/api/socketio',
        autoConnect: true,
      });
    }

    // 연결 이벤트 핸들러
    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    // 연결 해제 이벤트 핸들러
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    // 할 일 목록 업데이트 이벤트 핸들러
    const onTodoUpdate = () => {
      console.log('Todos updated, refreshing...');
      onTodoUpdated();
    };

    // 이벤트 리스너 등록
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(EVENTS.TODO_UPDATED, onTodoUpdate);

    // 소켓이 연결되어 있지 않으면 연결 시도
    if (!socket.connected) {
      socket.connect();
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off(EVENTS.TODO_UPDATED, onTodoUpdate);
    };
  }, [onTodoUpdated]);

  return { isConnected };
} 