import { Component, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {


  @ViewChild('mydiv') my_div:ElementRef | undefined;
  search_text:any='';
  visible_data:any[]=[];
  
  not_visible_data:any[]=['Plain','Relaxed','Solid','Washed'];

  remove_data(el:any){
    this.not_visible_data.push(el);
    this.visible_data=this.visible_data.filter((e)=>{return el!=e})
  }

  add_data(el:any){
    console.log("el is ",el);
   this.visible_data.push(el);
   this.not_visible_data=this.not_visible_data.filter((e)=>{return el!=e})
   
  }


  clicked(){
    console.log("my div is ",this.my_div);
    this.my_div?.nativeElement.classList.toggle('display_none');
  }

}
