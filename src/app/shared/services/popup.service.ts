import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private showPopupSubject = new BehaviorSubject<boolean>(false);
  showPopup$: Observable<boolean> = this.showPopupSubject.asObservable();
  private isPopupOpen = false; 
  constructor() { }

  openPopup() {
    if (!this.isPopupOpen) { 
      this.showPopupSubject.next(true);
      // this.isPopupOpen = true;
    }
  }

  closePopup() {
    this.showPopupSubject.next(false);
    // this.isPopupOpen = false;
  }
}
