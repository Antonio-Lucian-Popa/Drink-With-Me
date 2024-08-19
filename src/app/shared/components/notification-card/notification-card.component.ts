import { Component, EventEmitter, Output } from '@angular/core';
import { Notification } from '../../interfaces/notification';
import { WebSocketService } from './services/web-socket.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-notification-card',
  standalone: false,
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {

  @Output() isClosed = new EventEmitter<boolean>();

  notifications: Notification[] = [];

  constructor(private webSocketService: WebSocketService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserId().then(userId => {
      if(userId) {
        this.webSocketService.getNotifications(userId, 0, 5).subscribe((notifications: any) => {
          this.notifications = notifications.content;
        });
      }
    });

    this.webSocketService.newNotifications.subscribe((notification: any) => {
      this.notifications.unshift(notification);
    });
  }

  closeNotificationCard(): void {
    this.isClosed.emit(true);
  }
}
