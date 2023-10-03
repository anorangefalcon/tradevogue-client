import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private displaySubject = new BehaviorSubject<string>('');
  display$ = this.displaySubject.asObservable();

  constructor() { }
  sample: any = {
    display: '',
    content: {
      title: '',
      body: []
    }
  };

  successToast(data: any = ''){
    this.sample.display = 'success';
    this.sample.content.title = data.title || 'Item successfully added to cart!';
    this.sample.content.body = data.body;
    this.displaySubject.next(this.sample);
  }

  notificationToast(data: any = ''){
    this.sample.display = 'notification';
    this.sample.content.title = data.title || 'New Notification';
    this.sample.content.body = data.body;
    this.displaySubject.next(this.sample);
  }

  warningToast(data: any = ''){
    this.sample.display = 'warning';
    this.sample.content.title = data.title || 'Warning';
    this.sample.content.body = data.body;
    this.displaySubject.next(this.sample);
  }

  errorToast(data: any = ''){
    this.sample.display = 'error';
    this.sample.content.title = data.title || 'Error Occurred';
    this.sample.content.body = data.body;
    this.displaySubject.next(this.sample);
  }

}
