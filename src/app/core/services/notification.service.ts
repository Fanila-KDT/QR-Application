// notification.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<any>();

  // Expose as observable
  notifications$ = this.notificationSubject.asObservable();

  constructor() {
    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5191/notifications')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR error:', err));
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('NewJobcardInserted', (data) => {
      console.log('🔔 Notification received:', data);
      this.notificationSubject.next(data); // push event to subscribers
    });
  }
}
