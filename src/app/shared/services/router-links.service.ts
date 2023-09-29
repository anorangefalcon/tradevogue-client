import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterLinksService {

  constructor() { }
  showDataValue = new Subject<string>();
  // showData$ = this.showDataValue();

  updateShowData(data: string) {
    this.showDataValue.next(data);
    console.log("this.showdata val", this.showDataValue);
  }
}
