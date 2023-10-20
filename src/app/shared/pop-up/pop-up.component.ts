import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {
  showPopup = false;

  constructor(private popupService: PopupService) {
    this.popupService.showPopup$.subscribe((show) => {
      this.showPopup = show;
    });
  }

  closePopup() {
    this.popupService.closePopup();
  }
}

