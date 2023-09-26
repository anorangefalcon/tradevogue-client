import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterLinksService {

  constructor() { }
  private showDataValue = new BehaviorSubject<string>('profile');
  showData$ = this.showDataValue.asObservable();

  updateShowData(data: string) {
    this.showDataValue.next(data);
    console.log("this.showdata val", this.showDataValue);
  }
}
