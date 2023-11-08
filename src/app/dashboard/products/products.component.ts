import { Component, OnInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
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
  totalCount: any;
  selectAll: boolean = false;
  highlight: number = 0;
  deleteDataField: any = {};

  categoryOption!: any[];
  dataField: string[] = ['categories'];

  template: any = {
    limit: this.pageSize,
    page: this.currentPage,
    filter: {
      search: '',
      categories: '',
    }
  }

  // Contains all details about the product Displayed
  productArray: any = [];
  deleteList: any = [];
  productList: any[] = [];

  constructor(private element: ElementRef,
    private fetchdata: FetchDataService,
    private excelService: UploadExcelService,
    private backendUrl: UtilsModule,
    private dialogBoxService: DialogBoxService,
    private toastService: ToastService) { }

  async ngOnInit() {
    this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchFeatures, this.dataField).subscribe({
      next: (res: any) => {
        this.categoryOption = res.categories;
        this.fetchData();
      }
    });

    this.dialogBoxService.responseEmitter.subscribe(async (res: boolean) => {
      if (res == true) {
        await this.fetchdata.httpPost(this.backendUrl.URLs.deleteproducts, this.deleteDataField);
        this.fetchData();
      }
    });
  }

  async fetchData() {
    try {
      this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchProductInventory, this.template).subscribe({
        next: (res) => {
          console.log(res);

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
              rating: Math.round(product.avgRating * 10) / 10,
              last_updated: product.productInfo.updatedAt.split('T')[0],
              checked: false
            }
            this.productList.push(item);
          });

        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  highlightProduct(e: Event, id: string, index: number) {
    const status = (<HTMLInputElement>e.target).checked;
    
    // Purpose of Settime is to resolve the issue of delay as checkbox take time and function is called before
    setTimeout(() => {
      if (this.highlight >= 10 && status) {
        this.productList[index].highlight = false;
        this.toastService.notificationToast({ title: 'Maximum 10 Highlight Allowed' });
        return;
      }

      const body = { '_id': id, 'status': status };
      this.fetchdata.HTTPPOST(this.backendUrl.URLs.highlightProduct, body).subscribe({
        next: (data: any) => {
          this.highlight = data.highlightCount;
          this.productList[index].highlight = status;
        }
      })
    }, 0.1);
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
  deleteItem(entry: any, name: string = '', type: string = 'single') {
    this.dialogBoxService.confirmationDialogBox();
    this.deleteDataField.type = type,
      this.deleteDataField.data = entry;
  }

  // Filter Handling function
  updateFields(e: any, field: string = '') {

    if (field) {
      this.template.filter[field] = e;

    } else {
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
    this.currentPage = 1
    this.template.page = 1;

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
    let ratingArray = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        ratingArray.push('fa-solid fa-star');
      }
      else if (i > Math.floor(rating) && i <= Math.ceil(rating))
        ratingArray.push('fa-solid fa-star-half-stroke');
      else
        ratingArray.push('fa-regular fa-star');
    }
    return ratingArray;
  }

  // Purpose to detemine the quantiy of product->color->size based upon orderQuantity
  filterData(array: any, limit: any) {
    let filteredArray = array.filter((item: any) => item <= limit);
    return filteredArray;
  }

  displayInfo(e: Event) {
    console.log(<HTMLDivElement>(<HTMLDivElement>e.target));
    (<HTMLDivElement>(<HTMLDivElement>e.target)?.parentElement?.nextSibling)?.classList.add('active');
  }
  closeInfo(e: Event) {
    console.log(<HTMLDivElement>(<HTMLSpanElement>e.target).parentElement);
    (<HTMLDivElement>(<HTMLSpanElement>e.target).parentElement).parentElement?.classList.remove('active');
  }

  // Handles Excel File Uplaoded
  uploadFile(event: Event) {
    let excelData = this.excelService.handleFileInput(event);
    (<HTMLInputElement>event.target).value = '';

    console.log("HEllo");
    excelData.then((excel: any) => {

      if (excel.errors) {
        let errorObj: any = {
          title: 'Some Rows were Rejected',
          body: []
        };

        excel.errors.forEach((error: any) => {
          errorObj.body.push('Row: ' + error.row + ' Rejected from Sheet: ' + error.sheet);
        })

        this.toastService.errorToast(errorObj);
      }
      console.log("Excel Data", excel.data); // fine products
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

      // let product_keys = Object.keys(products['errors']);
      // this.toastService.errorToast({
      //   title: 'Errors found in Excel',
      //   body: ['In sheet First, Second']
      // })

      // product_keys.forEach((sheet) => {
      //   let sheets_keys = Object.keys(products['errors'][sheet]);
      // console.log(sheets_keys);

      // sheets_keys.forEach((errors) => {

      //   let error_list = Object.keys(products['errors'][sheet][errors]);
      //   console.log(error_list);

      // console.log(error_list); 

      // error_list.forEach((detail) => {
      //   console.log(detail);
      // })
      // })
      // })
    })
  }

  tableGenerator(len: number){
    let temp = []
    for(let i=0;i<len;i++){
      temp.push(0);
    }
    return temp;
  }
}
