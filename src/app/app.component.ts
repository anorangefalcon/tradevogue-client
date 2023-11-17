import { Component } from '@angular/core';
// import { SupportNotificationService } from './shared/services/support-notification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  'title': 'tradevogue';

  constructor() { }

  ngOnInit(): void {
    // this.notificationService.initialize();
  }

}