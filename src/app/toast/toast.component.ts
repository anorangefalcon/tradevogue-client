import { Component } from '@angular/core';
import { ToastService } from '../shared/services/toast.service';

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

  loadingWidth: number = 0;

  content: any = {
    title: 'Item successfully added to cart!',
    body: []
  }


  ErrorArray!:any[];

  constructor(private toastService: ToastService) {
    toastService.display$.subscribe((data: any) => {
      console.log('data come up is ',data);
      
      this.ErrorArray=JSON.parse(JSON.stringify(data));
      // this.ErrorArray.forEach((el)=>{
      //   el.display='';
      //   el.timeout = 5000;
      //   el.timeoutVar = ''
      //   el.content.title = data.content?.title;
      //   el.content.body = data.content?.body;
      //   el.timeoutVar='';
      // })

      console.log('Error array is ',this.ErrorArray);
      
      // this.display = '';
      // this.timeout = 5000;
      // this.display = data.display;
      // this.timeoutVar = ''
      // this.content.title = data.content?.title;
      // this.content.body = data.content?.body;

      if(this.ErrorArray.length>0){
        this.showToast();
      }
    })
  }

  showToast(index:any=false) {
    if(index){
    this.ErrorArray[index].start_time=Date.now();
    this.ErrorArray[index].timeoutVar=setTimeout(() => {
      this.ErrorArray[index].display = '';
    }, this.ErrorArray[index].timeout);

  }

    if(!index){
    this.ErrorArray.forEach((el)=>{
      el.start_time=Date.now();
      el.timeoutVar=setTimeout(() => {
        // el.display = '';
      }, el.timeout);
    })
  }
    // this.start_time = Date.now();
    
    // this.timeoutVar = setTimeout(() => {
    //   this.display = '';
    // }, this.timeout);
  }

  hoverIn(index:any) {
    this.ErrorArray[index].timeout = 5000 - (Date.now() -  this.ErrorArray[index].start_time);
    clearTimeout( this.ErrorArray[index].timeoutVar);
  }

  hoverOut(index:any) {
    this.showToast(index);
  }

}
