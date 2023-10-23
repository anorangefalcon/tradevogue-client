import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidecartService {
  private isSidecartOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isSidecartOpen$: Observable<boolean> = this.isSidecartOpenSubject.asObservable();

  toggleSidecart(isOpen: boolean): void {
    // this.isSidecartOpenSubject.next(isOpen);
  }
}
