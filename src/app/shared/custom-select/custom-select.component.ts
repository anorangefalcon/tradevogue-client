import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ElementRef, HostListener,  } from '@angular/core';


@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CustomSelectComponent {
  @Input () _id!: string;
  @Input () options: any[] = [];
  @Input () selectedOption: any;
  @Input () type: string = ''; // multiSelect //select //searchSelect
  @Output () final_option = new EventEmitter<string>();
  @Output () SelectedList = new EventEmitter<any>();

  selected: any = '';
  multiSelected: any[] = [];
  radioChecked: boolean = false;
  isactive:boolean = false;
  filter: string = '';

  constructor(private elementRef: ElementRef){}

  ngOnInit(){
    if((typeof(this.selectedOption) == "string" && !this.selectedOption.split(' ').includes('Select'))){
      this.selected = this.selectedOption;
    }else if( Array.isArray(this.selectedOption)){
      this.multiSelected = this.selectedOption;
    }
  }

  filterData(e: Event): any{
    const element =  e.target  as HTMLInputElement
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
    this.filter = '';
  }

  updateMutliSelected(e: Event){
    let element = <HTMLInputElement>e.target;
    
    if(element.checked && !this.multiSelected.includes(element.value)){
      this.multiSelected.push(element.value);
    }else{
      this.multiSelected = this.multiSelected.filter((item)=>{
        return item != element.value;
      })
    }
    this.SelectedList.emit(this.multiSelected);
  }

  @HostListener('document:click', ['$event']) onClick(e: Event){
    if(!this.elementRef.nativeElement.contains(e.target)){
      this.isactive = false;
    }
  }
}
