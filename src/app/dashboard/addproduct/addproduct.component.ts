import { Component, ElementRef } from '@angular/core';
import { CustomSelect } from 'src/app/shared/customSelect/custom-select';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
  // customSelect  =  new AddClassActive();

  constructor(private elem_ref: ElementRef){}

  ngAfterViewInit(){
    const element = this.elem_ref.nativeElement.querySelectorAll('.customSelect');
    let select = new CustomSelect(element);

    // const element1 = this.elem_ref.nativeElement.querySelector('.customSection1');
    // let select1 = new AddClassActive(element1);
  }
 
}
