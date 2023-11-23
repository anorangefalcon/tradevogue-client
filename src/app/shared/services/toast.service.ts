import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  ToastArray:any[]=[];
  private displaySubject = new BehaviorSubject<any>(this.ToastArray);
  display$ = this.displaySubject.asObservable();

  constructor() { }
  
  sample: any = {
    display: '',
    content: {
      title: '',
      body: []
    }
  };


  SendError(sample:any){
    console.log('this sample is ',this.sample);
    
    this.ToastArray.push(this.sample);
    console.log('toast array is ',this.ToastArray);
    
    this.displaySubject.next(this.ToastArray);
  }

  successToast(data: any = ''){
    this.sample.display = 'success';
    this.sample.content.title = data.title || 'Item successfully added to cart!';
    this.sample.content.body = data.body;
    this.SendError(this.sample);
  }

  notificationToast(data: any = ''){
    this.sample.display = 'notification';
    this.sample.content.title = data.title || 'New Notification';
    this.sample.content.body = data.body;
    this.SendError(this.sample);
  }

  warningToast(data: any = ''){
    this.sample.display = 'warning';
    this.sample.content.title = data.title || 'Warning';
    this.sample.content.body = data.body;
    this.SendError(this.sample);
  }

  errorToast(data: any = ''){
    console.log('data is ',data);
    
    this.sample.display = 'error';
    this.sample.content.title = data.title || 'Error Occurred';
    this.sample.content.body = data.body;
    this.SendError(this.sample);
  }

}
