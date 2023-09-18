import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { invalidformat } from 'src/app/shared/validators/imageValidators.validator';
import { UploadExcelService } from '../services/upload-excel.service';

@Component({
  selector: 'app-addproductfeatures',
  templateUrl: './addproductfeatures.component.html',
  styleUrls: ['./addproductfeatures.component.css']
})
export class AddproductfeaturesComponent {

  // FilterVariable
  categoriesFilter: any = '';
  brandsFilter: any = '';
  sizesFilter: any = '';
  tagsFilter: any = '';
  orderQuantitysFilter: any = '';

  // Form
  categories!: FormGroup;
  brands!: FormGroup;
  sizes!: FormGroup;
  tags!: FormGroup;
  orderQuantity!: FormGroup;

  // Data
  categoryList: string[] = [];
  brandsList: string[] = [];
  sizeList: string[] = [];
  colorsList: string[] = [];
  tagList: string[] = [];
  orderQuantityList: number[] = [];

  constructor(private featuredata: FetchDataService, private uploadExcel: UploadExcelService){}

  ngOnInit() {
    this.categories = new FormGroup({
      category: new FormControl('', [
        Validators.required,
        invalidformat
      ])
    })
    this.brands = new FormGroup({
      brand: new FormControl('', [
        Validators.required,
        invalidformat
      ])
    })
    this.sizes = new FormGroup({
      size: new FormControl('', [
        Validators.required,
        invalidformat
      ])
    })
    this.tags = new FormGroup({
      tag: new FormControl('', [
        Validators.required,
        invalidformat
      ])
    })
    this.orderQuantity = new FormGroup({
      quantity: new FormControl('', [
        Validators.required
      ])
    })
    

    // FetchData Service
    this.featuredata.getSellerData().subscribe((data: any)=>{
      this.categoryList = data[0]['categories'];
      console.log(this.categoryList);
      this.brandsList = data[0]['brands'];
      this.sizeList = data[0]['sizes'];
      this.orderQuantityList = data[0]['orderQuantity'];
      this.tagList = data[0]['tags'];
      this.colorsList = data[0]['colors'];
    });

  }

  uploadFile(event: Event, field: string){
    const data = this.uploadExcel.handleFileInput(event, field);
    console.log(data);
    data.then((resolve)=>{
      let items = resolve['data'];
      items.forEach((item: any)=>{
        if(!this.categoryList.includes(item))
          this.categoryList.push(item);
      })
    })
  }


  
  deleteItem(type: string, e: Event) {
    let target = <HTMLSpanElement>e.target;
    let targetElement = (<HTMLSpanElement>target.previousSibling).innerText;
    
    if (this.hasOwnProperty(type)) {
      let index = (this as any)[type].indexOf(targetElement);
      (this as any)[type].splice(index, 1);
    }
  }
  
  submit(type: string, form: string, control: string) {

    let item = (this as any)[form].get(control).value;
    if((this as any)[form].valid && !(this as any)[type].includes(item)){

      (this as any)[type].splice(0,0,item); 
      (this as any)[form].get(control).setValue('');
    }
    else{
      (this as any)[form].markAllAsTouched();
    }

    // if (item != '' && !(this as any)[type].includes(item) ) {
    //   (this as any)[type].splice(0,0,item);  
    // }
  }



}
