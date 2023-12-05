import { Component, OnDestroy } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnDestroy {
  showPopup = false;
  subscription: Subscription;

  constructor(private popupService: PopupService) {
    this.subscription =  this.popupService.showPopup$.subscribe((show) => {
      this.showPopup = show;
      if (!show) {
        this.closePopup();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closePopup() {
    this.showPopup = false;
    this.popupService.closePopup();
  }
}
