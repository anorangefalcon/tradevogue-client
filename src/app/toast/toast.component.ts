import { Component } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  display: string = '';
  timeout: any;
  on_time: any;
  timeoutVar: any;

  loadingWidth: number = 0;

  content: any = {
    title: 'Item successfully added to cart!',
    body: []
  }

  constructor(private toastService: ToastService) {
    toastService.display$.subscribe((data: any) => {
      this.display = '';
      this.timeout = 5000;
      this.display = data.display;
      this.content.title = data.content?.title;
      this.content.body = data.content?.body;

      this.showToast();
    })
  }

  showToast() {
    this.on_time = Date.now();

    this.timeoutVar = setTimeout(() => {
      this.display = '';
      console.log(Date.now(), 'done');
    }, this.timeout);
  }

  hoverIn() {
    clearTimeout(this.timeoutVar);
    this.timeout = Date.now() - this.on_time;
  }

  hoverOut() {
    this.showToast();
  }

}
