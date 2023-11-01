import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UploadExcelService } from '../services/upload-excel.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { first, take } from 'rxjs';

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

  // Template for Toast
  data_template: any = {
    title: '',
    body: []
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
    { name: 'Category', type: 'categories', filter: 'category', file_name: 'Categories_Sample' },
    { name: 'Brand', type: 'brands', filter: 'brand' },
    { name: 'Order Quantity', type: 'orderQuantity', filter: 'quantity' },
    { name: 'Product Tags', type: 'tags', filter: 'tags' }
  ];

  dataField: string[] = ['categories', 'brands', 'orderQuantity', 'tags'];

  constructor(
    private dataService: FetchDataService,
    private uploadExcel: UploadExcelService,
    private toastService: ToastService,
    private DialogBoxService: DialogBoxService,
    private backendurls: UtilsModule) { }

  async ngOnInit() {

    this.DialogBoxService.responseEmitter.subscribe(async (res) => {
      console.log("Inside Subscrive")
      if (res == true) {
        this.field_data[this.deleteObject.field].splice(this.deleteObject.index, 1);
        console.log("After Delete: ", this.field_data[this.deleteObject.field]);

        const data = {
          'field': this.deleteObject.field,
          'data': this.field_data[this.deleteObject.field]
        };

        this.dataService.HTTPPOST(this.backendurls.URLs.updateFeatures, data).subscribe({
          next: ()=>{
            this.toastService.successToast({ title: 'Item Deleted Successfully' });
          }
        }); 
      }

    })


    this.dataService.HTTPPOST(this.backendurls.URLs.fetchFeatures, this.dataField).subscribe({
      next: (res: any) => {
        this.field_data = res;
      }
    });
  }

  uploadFile(event: Event, field: string) {
    const fieldList = field.toLowerCase() + 'List';
    const dataObserver = this.uploadExcel.handleFileInput(event, field);
    console.log(field);
    console.log("File");

    dataObserver.then((resolve) => {
      console.log('data + errors', resolve);

      let items = resolve['data'];
      console.log(items, 'data', fieldList);

      items.forEach((item: any) => {
        if (!this.dataList[fieldList].includes(item))
          this.dataList[fieldList].push(item);
      })
    })
  }

  deleteItem(field: string, index: number) {
    console.log('deleted called');
    this.deleteObject.field = field;
    this.deleteObject.index = index;
    this.DialogBoxService.confirmationDialogBox(this.field_data[field][index]);
  }

  async addItem(item: any, field: string) {
    try {

      if (!this.field_data[field].includes(this.filter[item])) {

        this.field_data[field].push(this.filter[item]);
        this.filter[item] = '';

        const data = {
          'field': field,
          'data': this.field_data[field]
        };
        this.dataService.HTTPPOST(this.backendurls.URLs.updateFeatures, data).subscribe({
          next: (res: any) => {
            this.toastService.successToast({ title: 'Item Added Successfully' });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
