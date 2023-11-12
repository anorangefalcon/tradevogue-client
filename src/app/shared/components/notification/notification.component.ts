import { Component } from '@angular/core';
import { SupportNotificationService } from '../../services/support-notification.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  latestOrder: any; 
  showOrder: boolean = false;
  selectedTabIndexs = 0;
  products: any[] = [];
  showTextView: boolean = false;
  messages: any[] = [];
  newMessage: string = '';
  orderDetails: any;
  selectedOrder: any;
  public loadingProducts: boolean = true;
  showNewSection: boolean = false;
  Clicked: boolean = false;
  selectedProduct: any;
  buttonsHidden: boolean = false;
  previousOrders: any[] = [];
  showBellIcon: boolean = true;
  message: any;
  notificationOptions: any;
  fcmToken = this.cookie.get('fcmToken')

  // In your component class
notifications = [
  { title: 'New Message', body: 'You have a new message.' },
  { title: 'Notification', body: 'This is a notification.' },
  // Add more demo notifications as needed
];


ngOnInit(): void {
  this.notification.notificationOptions$.subscribe((options) => {
    this.notificationOptions = options;
    // Do something with the received options
    console.log(this.notificationOptions, "dfdfdfd->.>>>")
  });
}


  constructor(public notification: SupportNotificationService, private fetchService: FetchDataService, private utils: UtilsModule, private cookie: CookieService) {

  }

  // ngOnInit(): void {
  //   this.notification.requestPermission();
  //   this.notification.subscribeToMessages();
  //   this.message = this.notification.message;
  // }

  async subscribeToNotifications() {
    
     this.notification.initialize()
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
  
  
}

