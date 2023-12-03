import { Component } from '@angular/core';
import { ToastService } from '../shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  display: string = '';
  timeout: any;
  start_time: any;
  timeoutVar: any;

  content: any = {
    title: 'Item successfully added to cart!',
    body: []
  }

  constructor(toastService: ToastService) {
    toastService.display$.subscribe((data: any) => {
      this.display = '';
      this.timeout = 5000;
      this.display = data.display;
      this.timeoutVar = ''
      this.content.title = data.content?.title;
      this.content.body = data.content?.body;

      if(this.display){
        this.showToast();
      }
    })
  }

  showToast() {
    this.start_time = Date.now();
    
    this.timeoutVar = setTimeout(() => {
      this.display = '';
    }, this.timeout);
  }

  hoverIn() {
    this.timeout = 5000 - (Date.now() - this.start_time);
    clearTimeout(this.timeoutVar);
  }

  hoverOut() {
    this.showToast();
  }

  closeToast(){
    this.display = '';
  }

}
