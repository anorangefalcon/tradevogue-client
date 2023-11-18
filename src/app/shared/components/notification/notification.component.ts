import { Component, OnInit } from '@angular/core';
import { SupportNotificationService } from '../../services/support-notification.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { Router } from '@angular/router';
import { UtilsModule } from 'src/app/utils/utils.module';
import { LoginCheckService } from '../../services/login-check.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  showBellIcon: boolean = true;
  fcmToken: any;
  notifications: any[] = [];

  constructor(
    public notification: SupportNotificationService,
    private fetchService: FetchDataService,
    private router: Router,
    private util: UtilsModule,
    private userService: LoginCheckService
  ) {}

  ngOnInit(): void {
    this.userService.getUser('fcm').subscribe((token: any)=>{
      this.fcmToken = token;
    });
    
    this.notification.notificationOptions$.subscribe((options) => {
    });

    this.fetchService.HTTPGET(this.util.URLs.comingNotification)
      .subscribe((res: any) => {
        this.notifications = res;
      });
  }

  async subscribeToNotifications() {
    // Add your subscribe logic here if needed
    this.notification.initialize();
  }

  toggle() {
    const chatBox = document.querySelector('.messengers');
    this.showBellIcon = !this.showBellIcon;
    if (chatBox) {
      setTimeout(() => {
        chatBox.classList.toggle('expanded');
      }, 100);
    }
  }

  // Helper method to filter visible notifications
  visibleNotifications(): any[] {
    return this.notifications.filter(notification => notification.state);
  }

  // Helper method to check if there are any visible notifications
  hasVisibleNotifications(): boolean {
    return this.notifications.some(notification => notification.state);
  }

  redirectToUrl(url: string) {
    const baseUrl = window.location.origin;
    if (url.startsWith(baseUrl)) {
      const path = url.substring(baseUrl.length);
      this.router.navigate([path]);
    } else {
      this.router.navigate([url]);
    }
  }

  shareNotification(notification: any) {
    if (navigator.share) {
      navigator.share({
        title: notification.notification.title,
        text: notification.notification.body,
        url: notification.notification.url
      })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support Web Share API
    }
  }
}
