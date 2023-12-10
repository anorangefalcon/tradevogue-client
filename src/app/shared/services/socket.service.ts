import { Injectable } from '@angular/core';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private chatSocket: any;
  private notificationSocket: any;

  constructor() {
    this.initSockets();
  }

  private initSockets() {
    this.chatSocket = io('http://localhost:3000/chat', {
      transports: ['websocket']
    });

    this.chatSocket.on('connect', () => {
      console.log('Chat Socket connected:', this.chatSocket.connected);
    });

    this.notificationSocket = io('http://localhost:3000/notification', {
      transports: ['websocket']
    });

    this.notificationSocket.on('connect', () => {
      console.log('Notification Socket connected:', this.notificationSocket.connected);
    });
  }

  getChatSocket() {
    return this.chatSocket;
  }

  getNotificationSocket() {
    return this.notificationSocket;
  }
}
