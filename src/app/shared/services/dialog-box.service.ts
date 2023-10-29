import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogBoxService {
  constructor() { }

  public responseEmitter = new BehaviorSubject<any>('');
  public contentEmitter = new BehaviorSubject<string>('');

  template: any = {
    type: '',
    value: ''
  };

  successDialogBox(data: any = ''){
    this.template.type = 'success';
    this.template.value = data;
    this.contentEmitter.next(this.template);
  }

  confirmationDialogBox(data: any = ''){
    this.template.type = 'confirmation';
    this.template.value = data;
    this.contentEmitter.next(this.template);
    // this.responseEmitter.next(false);
  }


  
}
