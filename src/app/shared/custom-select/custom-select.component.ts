import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ElementRef, HostListener, } from '@angular/core';


@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CustomSelectComponent {
  @Input() _id!: string;
  @Input() disableStatus: boolean = false;
  @Input() options!: any[];
  @Input() selectedOption!: any;
  @Input() type: string = ''; // multiSelect //select //searchSelect
  @Output() final_option = new EventEmitter<string>();
  @Output() SelectedList = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any>();

  onSelectionChange(event: any) {
    this.selectionChanged.emit(this.selectedOption);
  }

  selected: any = '';
  multiSelected: any[] = [];
  radioChecked: boolean = false;
  isactive: boolean = false;
  filter: string = '';

  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {    
    if (this.type == 'multiSelect' && Array.isArray(this.selectedOption)) {
      this.multiSelected = this.selectedOption;
    }
    if(this.options){
      
      const isOptionValid = this.options.some(option => {
        if (typeof option === 'string' || option instanceof String) {
          return option.toString().toLowerCase() === this.selectedOption.toString().toLowerCase();
        } else {
          return option === this.selectedOption;
        }
      });
      
      if (isOptionValid) {
        this.selected = this.selectedOption;
      }
      else{
        this.selected = '';
      }
    }
  }

  isChecked(option: any, type='') {
    if(type == 'multiSelect'){
      return this.multiSelected.find((item: any) => option == item)? true: false;
    }
    return this.selected.toString().toLowerCase() == option.toString().toLowerCase();
  }

  filterData(e: Event): any {
    const element = e.target as HTMLInputElement
    // if (element.value.length == 0) {
    //   this.isactive = false;
    //   this.filter = '';
    //   return;
    // }
    this.isactive = true;
    this.filter = element.value;
  }

  toggleClass() {
    this.isactive = !this.isactive;
  }

  updateSelected(option: string) {
    this.selected = option;
    this.isactive = false;
    this.final_option.emit(option);
    this.filter = '';
  }

  updateMutliSelected(e: Event) {
    let element = <HTMLInputElement>e.target;

    if (element.checked && !this.multiSelected.includes(element.value)) {
      this.multiSelected.push(element.value);
    } else {
      this.multiSelected = this.multiSelected.filter((item) => {
        return item != element.value;
      })
    }
    this.SelectedList.emit(this.multiSelected);
  }

  @HostListener('document:click', ['$event']) onClick(e: Event) {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.isactive = false;
    }
  }
}
