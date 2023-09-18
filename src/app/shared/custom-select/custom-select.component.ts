import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent {
  @Input () options: any[] = [];
  @Input () selectedOption: any = '';
  @Input () type: string = ''; // Multi
  @Output () final_option = new EventEmitter<string>();
  @Output () SelectedList = new EventEmitter<any>();

  selected: any = '';
  multiSelected: any[] = [];
  isactive:boolean = false;
  clearbtn:boolean = true;
  
  ngOnInit(){
    this.selected = this.selectedOption;
  }

  toggleClass(){
    this.isactive  = !this.isactive;
  }
  
  updateSelected(option: string){
    this.selected = option;
    this.isactive = false;
    this.final_option.emit(option);
    this.clearbtn = true;
  }

  updateMutliSelected(e: Event){
    let element = <HTMLInputElement>e.target;
    if(element.checked){
      this.multiSelected.push(element.value);
      this.selected = "e";
    }else{
      this.multiSelected = this.multiSelected.filter((item)=>{
        return item != element.value;
      })
      this.SelectedList.emit(this.multiSelected);
    }
    console.log(this.multiSelected);
  }

  clearSelected(){
    this.selected = this.selectedOption;
    this.final_option.emit('');
  }

  // deleteOption(index: number){
  //   this.multiSelected.splice(index, 1);
  // }
}
