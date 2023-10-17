import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UploadExcelService } from '../services/upload-excel.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Out of Stock', 'Low Inventory', 'In Stock'];
  categoryOption: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratingOption: any[] = ['Low to High', 'High to Low'];
  pageSize: number = 8;
  currentPage: number = 1;
  productList: any[] = [];

  selectAll: boolean = false;

  template: any = {
    search: '',
    limit: this.pageSize,
    page: this.currentPage,
    filter: {
      stockStatus: '',
      categories: '',
      rating: '',
    }
  }

  constructor(private element: ElementRef,
    private fetchdata: FetchDataService,
    private excelService: UploadExcelService,
    private backendUrl: UtilsModule,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  productTemplate = ['Product Name', 'Category', 'Brand' ,'Price', 'Stock', 'Status', 'Published', 'Action'];

  async fetchData() {
    try{
      const result: any = await this.fetchdata.httpPost(this.backendUrl.URLs.fetchproducts, this.template);
      this.productList = [];
  
      result.forEach((product: any) => {
        product = {
          itemId: product.sku,
          image: product.assets[0].photo[0],
          name: product.name,
          price: product.price,
          category: product.info.category,
          brand: product.info.brand,
          unit_sold: product.unitSold,
          product_inventory: (product.totalStock - product.unitSold),
          rating: product.avgRating,
          last_updated: product.updatedAt.split('T')[0],
          checked: false
        }
        this.productList.push(product);
      })
    }catch(err){
      console.log(err);
    }
  }

  displayPage(id: string){

  }

  toggleSelectAll(){
    this.productList.forEach((product: any)=>{
      product.checked = this.selectAll;
    });
  }

  checkboxChanged(){
    if(this.isAllcheckboxChecked()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllcheckboxChecked(){
    return this.productList.every((product: any)=>product.checked);
  }

  deleteList: any = [];

  updateCheckList(){
    this.deleteList = [];
    this.productList.forEach((product: any)=>{
      if(product.checked) this.deleteList.push(product.itemId);
    });
    console.log(this.deleteList);
  }

  

  pageChanged(event: any) {
    this.currentPage = event;
  }

  // Delete Single Entry
  deleteItem(entry: any) {
    this.productList.splice(entry, 1);
  }

  // Filter Handling function
  updateFields(e: any, field: string) {
    this.template.filter[field] = e;
    console.log(this.template.filter);
    this.fetchData();
  }

  // DialogBox Response PRovided For Deletion
  response(e: any){
    if(e){
      
    }
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
