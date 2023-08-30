import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent {
  @Input () options: string[] = [];
  @Input () selectedOption: string = '';
  @Output () final_option = new EventEmitter<string>();

  Form:any;
  constructor(private fb:FormBuilder){


    console.log('this selected form value is ',this.selectedOption);
    

    
      
    
    }


  ngOnInit(){
    console.log('this selected form value  inside ngonoint is ',this.selectedOption);
    this.Form= this.fb.group(
  
      
      {
        name:this.fb.control(this.selectedOption,[this.defaultValueValidator('Select Country')]),
       
        
      }); 
   
  }

  isactive:boolean = false;

  toggleClass(){
    this.isactive  = !this.isactive;
  }

  updateSelected(option: string){
    this.selectedOption = option; 
    this.Form.get('name').setValue(this.selectedOption);
    this.final_option.emit(option);
    this.isactive = false;

  }


  defaultValueValidator(defaultValue: any) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === defaultValue) {
        return { defaultValueError: true };
      }
      return null;

    }
  };

  onSubmit(){
    console.log("form is ",this.Form);
    console.log("selected option is ",this.selectedOption);
    console.log("name values i s",this.Form.get('name').value);
    
    
    
  }





}
