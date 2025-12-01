import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessageDTO } from '../dto/MessageDTO';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socketSubject: BehaviorSubject<WebSocket | null> = new BehaviorSubject<WebSocket | null>(null);
  private messageSubject: Subject<MessageDTO> = new Subject<MessageDTO>();
  

  constructor(
    
  ) { }

  connect(token: string): void {
    if (this.socketSubject.value) {
      return;
    }

    const ws = new WebSocket(`wss://${environment.SOCKET_URL}/ws?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      this.socketSubject.next(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message: MessageDTO = JSON.parse(event.data);
        this.messageSubject.next(message);
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      this.socketSubject.next(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error', error);
    };
  }

  disconnect() {
    const ws = this.socketSubject.value;
    if (ws) {
      ws.close();
      this.socketSubject.next(null);
    }
  }

  sendMessage(msg: any) {
    const ws = this.socketSubject.value;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  get socket$(): Observable<WebSocket | null> {
    return this.socketSubject.asObservable();
  }

  get messages$(): Observable<MessageDTO> {
    return this.messageSubject.asObservable();
  }
}
