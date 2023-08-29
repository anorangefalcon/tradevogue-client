import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent {
  @Input () options: string[] = [];
  @Input () selectedOption: string = '';
  @Output () final_option = new EventEmitter<string>();

  isactive:boolean = false;

  toggleClass(){
    this.isactive  = !this.isactive;
  }

  updateSelected(option: string){
    this.selectedOption = option; 
    this.final_option.emit(option);
    this.isactive = false;
  }
}
