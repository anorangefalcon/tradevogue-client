import { Component, OnInit } from '@angular/core';
import { SupportNotificationService } from '../../services/support-notification.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  showBellIcon: boolean = true;
  fcmToken = this.cookie.get('fcmToken');
  notifications: any[] = [];

  constructor(
    public notification: SupportNotificationService,
    private fetchService: FetchDataService,
    private cookie: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notification.notificationOptions$.subscribe((options) => {
      console.log(options, "Notification Options");
    });

    this.fetchService.HTTPGET('http://localhost:1000/user/comingNotifications')
      .subscribe((res: any) => {
        console.log(res, "Notifications from Server");
        this.notifications = res;
      });
  }

  async subscribeToNotifications() {
    // Add your subscribe logic here if needed
    // this.notification.initialize();
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
    this.router.navigate([url]);
  }
}
