import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductFilterPipe } from '../Pipe/product-filter.pipe';


@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent {
  @Input () options: any[] = [];
  @Input () selectedOption: any = '';
  @Input () type: string = ''; // multiSelect //select //searchSelect
  @Output () final_option = new EventEmitter<string>();
  @Output () SelectedList = new EventEmitter<any>();

  selected: any = '';
  multiSelected: any[] = [];
  isactive:boolean = false;
  clearbtn:boolean = true;
  filter: string = '';
  
  ngOnInit(){
    console.log(this.type);
    // this.selected = this.selectedOption;
  }

  filterData(e: Event): any{
    const element =  e.target  as HTMLInputElement
    // console.log((e.target  as HTMLInputElement).value.length);
    if(element.value.length == 0){
      this.isactive = false;
      this.filter = '';
      return;
    } 
    this.isactive = true;
    this.filter = element.value;

  }

  toggleClass(){
    this.isactive  = !this.isactive;
  }
  
  updateSelected(option: string){
    this.selected = option;
    this.isactive = false;
    this.final_option.emit(option);
    this.clearbtn = true;
    this.filter = '';
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

  collapseSelect(e: Event){
    console.log(e.target);
  }

  // deleteOption(index: number){
  //   this.multiSelected.splice(index, 1);
  // }
}
