import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UploadExcelService } from '../services/upload-excel.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-addproductfeatures',
  templateUrl: './addproductfeatures.component.html',
  styleUrls: ['./addproductfeatures.component.css']
})
export class AddproductfeaturesComponent {

  // Data array
  dataList: any = {
    categoriesList: [],
    brandsList: [],
    sizesList: [],
    tagsList: [],
    orderQuantityList: [],
  }

  //Data
  filter: any = {
    category: '',
    brand: '',
    sizes: '',
    tags: '',
    quantity: ''
  }

  field_data: any;
  popup: boolean = false;

  deleteObject: any = {
    field: '',
    index: '',
  }
  

  // Type Name should be same as that of backend (avoiding conflicts)
  card_template: any = [
    {name: 'Category', type: 'categories', filter: 'category', file_name: 'Categories_Sample'},
    {name: 'Brand', type: 'brands', filter: 'brand'},
    {name: 'Order Quantity', type: 'orderQuantity', filter: 'quantity'},
    {name: 'Product Tags', type: 'tags', filter: 'tags'}
  ];

  constructor(
    private dataService: FetchDataService,
    private uploadExcel: UploadExcelService, 
    private toastService: ToastService,
    private backendurls: UtilsModule){}

  async ngOnInit() {
    this.field_data =  await this.dataService.httpGet(this.backendurls.URLs.fetchFeatures);
  }


  uploadFile(event: Event, field: string){
    const fieldList = field.toLowerCase() + 'List';
    const dataObserver = this.uploadExcel.handleFileInput(event, field);
    console.log(field);
    console.log("File");
    
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

  async deleteItem(e: any){
    this.popup = false;
    if(e == true){
      this.field_data[this.deleteObject.field].splice(this.deleteObject.index, 1);
      const data = {
        'field': this.deleteObject.field,
        'data': this.field_data[this.deleteObject.field]
      };
      await this.dataService.httpPost(this.backendurls.URLs.updateFeatures, data);
    }
  }

  async addItem(item: any, field: string){
    if(!this.field_data[field].includes(this.filter[item])){
        this.field_data[field].push(this.filter[item]);  
        this.filter[item]='';
  
        const data = {
          'field': field,
          'data': this.field_data[field]
        };
        await this.dataService.httpPost(this.backendurls.URLs.updateFeatures, data);
        return;
    }  
  }

  confirmation(field: string, index: number) {
    this.popup = true;
    this.deleteObject.field = field;
    this.deleteObject.index = index;
  }

}
