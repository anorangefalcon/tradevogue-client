import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private showPopupSubject = new BehaviorSubject<boolean>(false);
  showPopup$: Observable<boolean> = this.showPopupSubject.asObservable();

  constructor() { }

  openPopup() {
    this.showPopupSubject.next(true);
  }

  closePopup() {
    this.showPopupSubject.next(false);
  }
}
