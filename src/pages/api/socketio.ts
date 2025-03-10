import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponseWithSocket } from '@/lib/socket';
import { setSocketInstance } from '@/app/api/todos/route';

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket.IO server already running');
    res.end();
    return;
  }

  console.log('Setting up Socket.IO server...');
  const io = new SocketIOServer(res.socket.server as NetServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });
  
  res.socket.server.io = io;
  
  // 할 일 API에 Socket.IO 인스턴스 전달
  setSocketInstance(io);

  console.log('Socket.IO server initialized');
  res.end();
} 