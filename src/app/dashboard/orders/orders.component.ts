import { Component, ElementRef} from '@angular/core';
import { first, take } from 'rxjs';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import * as xlsx from 'xlsx';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  order_status:string = 'Completed';
  payment_status: string = 'Confirmed';
  paymentStatus: any[] = ['Confirmed', 'Pending', 'Failed', 'Canceled'];
  orderData: any[] = [];
  pageSize: number = 8;
  currentPage: number = 1;
  selectedColor: any = 0;
  totalCount: any;
  updateIndex: any = false; //Purpose of invoice Avalibility
  updateIndexStatus: any; //For puspose of Input status
  filename: string = 'Orders.xlsx';

  orderStats: any = {
    confirmed: 0,
    shipped: 0,
    cancelled: 0,
    delivered: 0
  }

  template: any = {
    limit: this.pageSize,
    page: this.currentPage,
    filter: {
      search: '',
      payment_status: '',
      dateto: '',
      datefrom: ''
    }
  }

  constructor(
    private dialogService: DialogBoxService, 
    private fetchData: FetchDataService, 
    private backendUrl: UtilsModule){}

  async ngOnInit(){
    this.fetchStats();
    this.fetchOrders();

    this.dialogService.responseEmitter.subscribe((res: any)=>{

      if(!res){
        this.orderData[this.updateIndex].invoice_status = false
      }

      if(res && this.updateIndexStatus){
        this.orderData[this.updateIndex].invoice_status = true;
      } 
    })
  }

  downloadExcel(){
    let element = document.getElementById('order-excel-table'); 
    const ws: xlsx.WorkSheet =xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, this.filename);
  }

  fetchStats(){
    this.fetchData.HTTPGET(this.backendUrl.URLs.getOrderOverallData).subscribe({
      next: (stats: any)=>{
        this.orderStats = stats;

        stats.forEach((data: any)=>{
          if(data.status){
            this.orderStats[data.status] = data.count;
          }
        })
      }
    })
  }

  fetchOrders(){
    this.fetchData.HTTPPOST(this.backendUrl.URLs.getSellerOrders, this.template).subscribe({
      next: (data: any)=>{
        if(!data.length){
          this.orderData = [0]
          return;
        }
        this.orderData = [];
        data.forEach((order: any)=>{
          let orderInfo = {
            orderID: order.data.orderID,
            customer: order.customer,
            orderTime: (new Date(order.data.orderDate)).toDateString(),
            amount: order.data.orderAmount,
            quantity: order.orderQuantity,
            payment_status:  order.data.payment_status,
            invoice_status: order.data.invoice_status,
            _id: order._id
          };
          this.orderData.push(orderInfo);
        });
      }
    });
  }

  dialogTemplate: any = {
    title: 'Want to make Invoice Available?',
    type: 'confirmation',
    confirmationText: 'Yes, Avial it',
    cancelText: 'No, Cancel it',
  }

  updateInvoice(e: Event, index: number, _id: string){
    this.updateIndexStatus = (<HTMLInputElement>e.target).checked;
    if(this.updateIndexStatus){
      this.dialogTemplate.title = 'Want to make Invoice Available?';
    }else{
      this.dialogTemplate.title = 'Want to make Invoice Unavailable?';
    }
    this.dialogService.confirmationDialogBox(this.dialogTemplate);
    this.updateIndex = index;
  }

  pageChanged(event:any){
    this.currentPage = event;
    this.template.page = event;
    this.fetchOrders();
  }

  updateFields(e: any, type: string){
    this.template.filter[type] = e;
    this.fetchOrders();
  }

  updateDateFields(e: Event, field: string){
    
    this.template.filter[field] = (<HTMLInputElement>e.target).value;
    this.fetchOrders();
  }

  tableGenerator(len: number){
    let temp = []
    for(let i=0;i<len;i++){
      temp.push(0);
    }
    return temp;
  }
}
