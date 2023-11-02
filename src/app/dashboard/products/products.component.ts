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
  pageSize: number = 8;
  currentPage: number = 1;
  selectedColor: any = 0;
  totalCount: any;
  selectAll: boolean = false;

  categoryOption!: any[];
  dataField: string[] = ['categories'];
  productTemplate = ['Product Name', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Published', 'Action'];


  template: any = {
    limit: this.pageSize,
    page: this.currentPage,
    filter: {
      search: '',
      categories: '',
    }
  }

  deleteDataField: any = {};

  // Contains all details about the product Displayed
  productArray: any = [];
  deleteList: any = [];
  productList: any[] = [];
  constructor(private element: ElementRef,
    private fetchdata: FetchDataService,
    private excelService: UploadExcelService,
    private backendUrl: UtilsModule,
    private dialogBoxService: DialogBoxService,
    private toastService: ToastService,) { }

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
        this.dialogBoxService.responseEmitter.next(false);
      }
    });
  }

  async fetchData() {
    try {
      this.fetchdata.HTTPPOST(this.backendUrl.URLs.fetchProductInventory, this.template).subscribe({
        next: (res) => {
          this.productArray = res;
          this.productList = [];
          this.totalCount = this.productArray.pageInfo[0].count;
          this.productArray.data.forEach((product: any) => {
            let item = {
              _id: product.productInfo._id,
              itemId: product.productInfo.sku,
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
          })
        }
      });
    } catch (err) {
      console.log(err);
    }
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
    this.dialogBoxService.confirmationDialogBox(name);
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
    this.fetchData();
  }

  pageChange(e: any) {
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

  filterData(array: any, limit: any) {
    let filteredArray = array.filter((item: any) => item <= limit);
    // console.log(array, "   --  ", limit, " --> ", filteredArray);

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
    let data = this.excelService.handleFileInput(event);
    data.then((products) => {
      console.log(products);

      let product_keys = Object.keys(products['errors']);
      this.toastService.errorToast({
        title: 'Errors found in Excel',
        body: ['In sheet First, Second']
      })

      product_keys.forEach((sheet) => {
        let sheets_keys = Object.keys(products['errors'][sheet]);
        // console.log(sheets_keys);

        // sheets_keys.forEach((errors) => {

        //   let error_list = Object.keys(products['errors'][sheet][errors]);
        //   console.log(error_list);

        // console.log(error_list); 

        // error_list.forEach((detail) => {
        //   console.log(detail);
        // })
        // })
      })
    })
  }
}
