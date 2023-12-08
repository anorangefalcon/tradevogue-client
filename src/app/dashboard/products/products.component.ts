import { Component, OnInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UploadExcelService } from '../services/upload-excel.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  sortOption: any[] = ['Rating: Low to High', 'Rating: High to Low', 'Stock: Low to High', 'Stock: High to Low'];
  productTemplate: any[] = ['Product Name', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Published', 'Action'];
  pageSize: number = 8;
  currentPage: number = 1;
  selectedColor: any = 0;
  totalCount: any = 0;
  selectAll: boolean = false;
  highlight: number = 0;
  deleteDataField: any = {};

  categoryOption!: any[];
  dataField: string[] = ['categories'];

  template: any = {
    limit: this.pageSize,
    page: this.currentPage,
    filter: {
      active: true,
      search: '',
      categories: '',
    }
  }

  // Contains all details about the product Displayed
  productArray: any = [];
  deleteList: any = [];
  productList: any[] = [];
  dataFetchStatus: boolean = true;

  constructor(
    private fetchdata: FetchDataService,
    private excelService: UploadExcelService,
    private backendUrl: UtilsModule,
    private dialogBoxService: DialogBoxService,
    private toastService: ToastService) {

    this.dialogBoxService.responseEmitter.subscribe(async (res: boolean) => {
      if (res == true) {
        this.fetchdata.HTTPPOST(this.backendUrl.URLs.deleteproducts, this.deleteDataField).subscribe(() => {
          this.fetchData();
          this.dialogBoxService.responseEmitter.next(false);
        });
      }
    });

  }

  async ngOnInit() {

    this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchFeatures, this.dataField).subscribe({
      next: (res: any) => {
        this.categoryOption = res.categories;
        this.fetchData();
      }
    });
  }

  async fetchData() {
      this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchProductInventory, this.template).subscribe({
        next: (res: any) => {

          if (!res.data.length) {
            this.dataFetchStatus = false;
            this.productList = [];
            this.totalCount = 0;
            return;
          };

          console.log('res', res);

          this.productArray = res;
          this.productList = [];
          this.totalCount = this.productArray.pageInfo[0].count;
          this.highlight = this.productArray.pageInfo[0].highlightCount;

          this.productArray.data.forEach((product: any) => {

            let item = {
              _id: product.productInfo._id,
              itemId: product.productInfo.sku,
              highlight: product.productInfo.highlight,
              image: product.productInfo.assets[0].photo[0],
              name: product.productInfo.name,
              price: product.productInfo.price,
              category: product.productInfo.info.category,
              assets: product.productInfo.assets,
              brand: product.productInfo.info.brand,
              unit_sold: product.unitSold,
              orderQuantity: product.productInfo.info.orderQuantity,
              product_inventory: product.inventory,
              status: product.productInfo.status,
              rating: Math.round(product.avgRating * 10) / 10,
              star: this.starRating(Math.round(product.avgRating * 10) / 10),
              last_updated: product.productInfo.updatedAt.split('T')[0],
              checked: false
            }
            this.productList.push(item);
          });
        }
      });
  }

  highlightProduct(e: Event, id: string, index: number) {
    const status = (<HTMLInputElement>e.target).checked;

    // Purpose of Settime is to resolve the issue of delay as checkbox take time and function is called before
    setTimeout(() => {

      if (this.highlight >= 10 && status) {
        this.productList[index].status.highlight = false;
        this.toastService.notificationToast({ title: 'Maximum 10 Highlight Allowed' });
        return;
      }

      const body = { '_id': id, 'status': status, 'field': 'highlight' };
      this.fetchdata.HTTPPOST(this.backendUrl.URLs.productStatus, body).subscribe({
        next: (data: any) => {
          this.highlight = data.highlightCount;
          this.productList[index].status.highlight = status;
        },
        error: () => {
          this.productList[index].status.highlight = false;
        }
      })
    }, 0.1);
  }

  activateProduct(e: Event, id: string, index: number) {

    const status = (<HTMLInputElement>e.target).checked;
    const body = { '_id': id, 'status': status, 'field': 'active' };

    // this.template['productID'] = id;

    // this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchProductInventory, this.template).subscribe({
    //   next: (res: any) => {
    //     console.log("sdasd", res);
    //     delete this.template.productID;
    //   }[(ngModel)]="item.status.active"
    // });


    this.fetchdata.HTTPPOST(this.backendUrl.URLs.productStatus, body).subscribe({
      next: (data: any) => {
        console.log(data);
        this.productList[index].status.active = status;
        status ? this.toastService.successToast({ title: 'Product is Available' }) : this.toastService.notificationToast({ title: 'Product is now Unavailable' });
        this.fetchData();
      },
      error: () => {
        this.productList[index].status.active = false;
      }
    })
  }

  // Check for tables
  toggleSelectAll() {
    this.productList.forEach((product: any) => {
      product.checked = this.selectAll;
    });
  }

  checkboxChanged() {
    if (this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllcheckboxChecked() {
    return this.productList.every((product: any) => product.checked);
  }

  updateCheckList() {
    this.deleteList = [];
    this.productList.forEach((product: any) => {
      if (product.checked) this.deleteList.push(product._id);
    });
  }


  // Delete Entry
  deleteItem(entry: any, type: string = 'single') {

    let template: any = {
      title: 'Proceed with Deletion?',
      subtitle: `The item will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?`,
      type: 'confirmation',
      confirmationText: 'Yes, Delete it',
      cancelText: 'No, Keep it',
    };

    this.dialogBoxService.confirmationDialogBox(template);
    this.deleteDataField.type = type,
      this.deleteDataField.data = entry;
  }

  // Filter Handling function
  tempSortData: string = '';

  updateFields(e: any, field: string = '') {

    if (field) {
      this.template.filter[field] = e;

    } else {
      this.tempSortData = e;
      let data = e.split(':');
      delete this.template.filter['rating'];
      delete this.template.filter['stockQuantity'];

      if (data[0] == 'Rating') {
        (data[1].trim(' ') == "Low to High") ? this.template.filter['rating'] = 1 : this.template.filter['rating'] = -1;
      } else {
        (data[1].trim(' ') == "Low to High") ? this.template.filter['stockQuantity'] = 1 : this.template.filter['stockQuantity'] = -1;
      }
    }

    // reset Pagination
    this.currentPage = 1;
    this.template.page = 1;

    this.fetchData();
  }

  clearFields() {
    this.tempSortData = '';
    this.template.filter.categories = '';
    delete this.template.filter['rating'];
    delete this.template.filter['stockQuantity'];
    this.fetchData();
  }

  pageChange(e: any) {
    this.template.page = e;
    this.currentPage = e;
    this.fetchData();
  }

  isradioChecked(e: Event, color_index: number) {
    if ((<HTMLInputElement>e.target).checked) {
      this.selectedColor = color_index;
    }
  }

  fetchOrderQuantity(quantity: number, orderArray: any) {
    return orderArray.filter((amt: any) => {
      return amt <= quantity;
    });
  }

  // Generate a string array based upon rating transmitted store class from 'font-awesome'
  starRating(rating: any) {
    let ratingArray: any = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        ratingArray.push({ field: 'star', class: 'filled'});
      }
      else if (i > Math.floor(rating) && i <= Math.ceil(rating))
        ratingArray.push({ field: 'star_half', class: '' });
      else
        ratingArray.push({ field: 'star', class: '' });
    }
    return ratingArray;
  }

  // Purpose to detemine the quantiy of product->color->size based upon orderQuantity
  filterData(array: any, limit: any) {

    const len = array.length;
    // 30% of Array is
    const index = Math.round(len * 0.3);

    if (limit <= array[index] && limit > 0) {
      return true;
    }
    return false;
  }

  displayInfo(e: Event) {
    (<HTMLDivElement>(<HTMLDivElement>e.target)?.parentElement?.nextSibling)?.classList.add('active');
  }
  closeInfo(e: Event) {
    (<HTMLDivElement>(<HTMLSpanElement>e.target).parentElement).parentElement?.classList.remove('active');
  }

  // Handles Excel File Uplaoded
  uploadFile(event: Event) {

    let excelData = this.excelService.handleFileInput(event);
    (<HTMLInputElement>event.target).value = '';
    excelData.then((excel: any) => {

      if (excel.errors.length) {
        let errorObj: any = {
          title: 'Some Rows were Rejected',
          body: []
        };

        excel.errors.forEach((error: any) => {
          errorObj.body.push('Row: ' + error.row + ' Rejected from Sheet: ' + error.sheet);
        })

        this.toastService.errorToast(errorObj);
      }
      if (excel.data.length) {

        const formData = {
          type: 'bulk',
          data: excel.data
        };
        this.fetchdata.HTTPPOST(this.backendUrl.URLs.addproduct, formData).subscribe({
          next: (res: any) => {
            this.toastService.successToast("Data Uploaded Successfuly");
            this.fetchData();
          }
        })
      }

    })
  }

  exportProductsExcel() {
    let exportArr = this.productArray.data.filter((item: any) =>
      this.deleteList.includes(item._id)).map((item: any) => item.productInfo);

    this.excelService.exportProductsInExcel(exportArr);
  }

  tableGenerator(len: number) {
    let temp = []
    for (let i = 0; i < len; i++) {
      temp.push(0);
    }
    return temp;
  }
}
