import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UploadExcelService } from '../services/upload-excel.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { Subscription, first, take } from 'rxjs';

@Component({
  selector: 'app-addproductfeatures',
  templateUrl: './addproductfeatures.component.html',
  styleUrls: ['./addproductfeatures.component.css']
})
export class AddproductfeaturesComponent {

  isfetch: boolean = false;
  allSubscriptions: Subscription[] = [];
  // Toast template
  template = {
    title: ''
  }

  //Data
  filter: any = {
    category: '',
    brand: '',
    sizes: '',
    tags: '',
    orderQuantity: ''
  }

  field_data: any;
  popup: boolean = false;

  deleteObject: any = {
    field: '',
    index: '',
  }


  // Type Name should be same as that of backend (avoiding conflicts)
  card_template: any = [
    { name: 'Category', type: 'categories', filter: 'category', file_name: 'Categories_Sample', loading: false },
    { name: 'Brand', type: 'brands', filter: 'brand', file_name: 'Brands_Sample', loading: false },
    { name: 'Order Quantity', type: 'orderQuantity', filter: 'orderQuantity', file_name: 'orderQuantity_Sample', loading: false },
    { name: 'Product Tags', type: 'tags', filter: 'tags', file_name: 'Tags_Sample', loading: false }
  ];

  dataField: string[] = ['categories', 'brands', 'orderQuantity', 'tags'];
  pageTheme: any;
  
  constructor(
    private dataService: FetchDataService,
    private uploadExcel: UploadExcelService,
    private toastService: ToastService,
    private DialogBoxService: DialogBoxService,
    private backendurls: UtilsModule) { 
      this.allSubscriptions.push(
        this.dataService.themeColor$.subscribe((theme: any) => {
          this.pageTheme = theme;
        })
      );
    }

  ngOnInit() {

    this.allSubscriptions.push(
      this.DialogBoxService.responseEmitter.subscribe((res) => {
        if (res == true) {
          this.field_data[this.deleteObject.field].splice(this.deleteObject.index, 1);
          this.template.title = 'Item Deleted Successfully';
          this.crudData(this.deleteObject.field, null);
        }
      })
    )
    this.isfetch = true;

    this.allSubscriptions.push(
      this.dataService.HTTPPOST(this.backendurls.URLs.fetchFeatures, this.dataField).subscribe({
        next: (res: any) => {
          this.field_data = res;
          this.isfetch = false;
        }
      }));
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
  }

  uploadFile(event: Event, field: string) {
    const dataObserver = this.uploadExcel.handleFileInput(event, field);

    dataObserver.then((resolve) => {
      let items = resolve['data'];

      if (!items.length) this.toastService.errorToast({ title: 'File Data Format Mismatched' });
      else {
        items.forEach((item: any) => {
          let res = this.field_data[field].some((data: any) => (String(data)).toLowerCase() == (String(item)).toLowerCase());
          if (!res) this.field_data[field].push(item);
        });
        this.template.title = 'Items Added Successfully'
        this.crudData(field, null);
      }
    });
  }

  deleteItem(field: string, index: number) {
    this.deleteObject.field = field;
    this.deleteObject.index = index;
    let template: any = {
      title: 'Proceed with Deletion?',
      subtitle: `The item will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?`,
      type: 'confirmation',
      confirmationText: 'Yes, Delete it',
      cancelText: 'No, Keep it',
    };
    this.DialogBoxService.confirmationDialogBox(template);
  }

  addItem(item: any, field: string, index: number) {
    if (!this.field_data[field].includes(this.filter[item])) {
      item = item.trim();
      let pattern = /\b(?:[^!@#$%^&*(),.?":{}|<>]+|\s)+\b/g;

      if ((item.match(pattern)).length > 1) {
        this.toastService.errorToast({ title: 'Special Character not Allowed' });
        return;
      }

      this.field_data[field].push(this.filter[item]);
      this.filter[item] = '';
      this.template.title = 'Item Added Successfully'
      this.crudData(field, index);
    }
  }

  crudData(field: any, index: any) {

    if (index != null) {
      this.card_template[index].loading = true;
    }

    let data: any = {
      'field': field,
      'data': this.field_data[field]
    };
    this.allSubscriptions.push(
      this.dataService.HTTPPOST(this.backendurls.URLs.updateFeatures, data).subscribe({
        next: (res: any) => {
          this.toastService.successToast(this.template);
          if (index != null) {
            this.card_template[index].loading = false;
          }
        }
      }));
  }

  tableGenerator(len: number) {
    let temp = []
    for (let i = 0; i < len; i++) {
      temp.push(0);
    }
    return temp;
  }
}

