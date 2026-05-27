import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      // Decouple socket server target to use VITE_SOCKET_URL env variable,
      // with a fallback to API_URL (minus /api suffix) or localhost:5000.
      const rawApiUrl = import.meta.env.VITE_API_URL || '';
      const fallbackSocketUrl = rawApiUrl.replace(/\/api$/, '') || 'http://localhost:5000';
      const socketUrl = import.meta.env.VITE_SOCKET_URL || fallbackSocketUrl;

      console.log(`[Socket] Connecting to server at: ${socketUrl}`);
      
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Bind all registered event listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => {
          this.socket.on(event, cb);
        });
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  join(userId) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }

  joinContract(contractId) {
    if (this.socket) {
      this.socket.emit('join_contract', contractId);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
