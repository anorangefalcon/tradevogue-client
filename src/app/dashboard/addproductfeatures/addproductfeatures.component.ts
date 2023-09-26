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
  dataList: any = {
    categoryList: [],
    brandsList: [],
    sizesList: [],
    colorsList: [],
    tagsList: [],
    quantitiesList: [],
  }

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
      this.dataList.categoryList = data[0]['categories'];
      console.log(this.dataList.categoryList);
      this.dataList.brandsList = data[0]['brands'];
      this.dataList.sizesList = data[0]['sizes'];
      this.dataList.quantitiesList = data[0]['orderQuantity'];
      this.dataList.tagsList = data[0]['tags'];
      this.dataList.colorsList = data[0]['colors'];
    });

  }

  uploadFile(event: Event, field: string){
    const fieldList = field.toLowerCase() + 'List';
    const dataObserver = this.uploadExcel.handleFileInput(event, field);
    console.log(field);
    
    dataObserver.then((resolve)=>{
      console.log('data + errors',resolve);
      
      let items = resolve['data'];
      console.log(items, 'data', fieldList);
      
      items.forEach((item: any)=>{
        if(!this.dataList[fieldList].includes(item))
          this.dataList[fieldList].push(item);
      })
    })
  }
  
  deleteItem(type: string, index: number) {
    this.dataList[type].splice(index, 1);
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
