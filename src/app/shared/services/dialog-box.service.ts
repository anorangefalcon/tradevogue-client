import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogBoxService {
  constructor() { }

  public responseEmitter = new Subject<any>();
  public contentEmitter = new BehaviorSubject<string>('');

  template1: any = {
    title: 'Proceed with Deletion?',
    subtitle: "You can't view this in your list anymore if you delete!",
    confirmationText: 'Yes, Delete it',
    cancelText: 'No, Keep it',
    type: 'confirmation'
  }

  template2: any = {
    title: 'Mail Sent Successfully',
    subtitle: 'We have successfully sent the mail to your registered email which includes a link to change your passwords',
    type: 'info'
  }


  template: any = {
    title: '',
    subtitle: '',
    type: '',
    confirmationText: '',
    cancelText: '',
  };

  infoDialogBox(data: any = '') {
    if (!data) {
      this.template = this.template2;
    }else{
      this.template.type = 'info';
      this.template.title = data.title;
      this.template.subtitle = data.subtitle;
    }
    this.contentEmitter.next(this.template);
  }

  confirmationDialogBox(data: any = '') {
    if (!data) {
      this.template = this.template1;
    }else{
      this.template.type = 'confirmation';
      this.template.title = data.title;
      this.template.subtitle = data.subtitle;
      this.template.confirmationText = data.confirmationText;
      this.template.cancelText = data.cancelText;
      this.template.cancelText = data.cancelText;
    }
    this.contentEmitter.next(this.template);
  }



}
