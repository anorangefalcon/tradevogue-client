import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  DefaultShowOrders = 'active';
  loading: Boolean = false;
  currentPage: number = 1;
  AllOrders!: any;
  openedAccordionIndex: number | null = null;
  AccordianIndex: number = 0;
  totalCount: number = 0;
  CancelledOrders!: any[];
  cancelledOrdersCount: number = 0;
  cancelledCurrentPage: number = 1;

  cancelledTempatePagination: any = {
    currentPage: this.cancelledCurrentPage,
    limit: 80,
    paymentStatus:'refund',
    active: false
  }



  template: any = {
    title: 'Are You Sure! Want to Cancel?',
    subtitle: `You can't view this in your list anymore if you delete!`,
    type: 'confirmation',
    confirmationText: 'Yes, Cancel it',
    cancelText: 'No, Revert'
  };

  TemplatePagination: any = {
    currentPage: this.currentPage,
    limit: 80,
    active: true, paymentStatus: 'success'

  }

  constructor(private fetchDataService: FetchDataService, private backendURLs: UtilsModule, private dialogBoxService: DialogBoxService) {

  }
  ngOnInit() {
    this.loading = true;
    this.DefaultShowOrders = 'active';
    this.pageChange(1);
    this.toggleAccordian(0);
  }
  pageChange(pageNo: number) {

    this.currentPage = pageNo;
    this.getOrders();
  }

  getOrders() {
    console.log('get order called');

    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.getParticularUserOrders, this.TemplatePagination).subscribe((data: any) => {
      if (!data.length) {
        this.totalCount = 0;
        this.AllOrders = '';
      }
      else {
        this.AllOrders = data[0]?.document;
        console.log('all order assigned new ', this.AllOrders);
        this.totalCount = data?.length;
      }
      this.loading = false;
    });
  }
  getCancelledOrders() {
    // this.TranslateData = true;
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.getParticularUserOrders, this.cancelledTempatePagination).subscribe((data: any) => {
      if (!data.length) {
        this.cancelledOrdersCount = 0;
      }
      else {
        this.CancelledOrders = data[0]?.document;
        this.cancelledOrdersCount = data[0]?.count;
      }
      this.loading = false;
    });


  }

  getDate(orderDate: any) {
    return orderDate.split('T')[0];
  }

  toggleAccordian(index: any, check: boolean = false) {

    this.AccordianIndex = index;

    if (check) {
      this.openedAccordionIndex = index;
      return;
    }
    if (this.openedAccordionIndex === index) {
      this.openedAccordionIndex = null;
    } else {
      this.openedAccordionIndex = index;
    }
  }
  deletiontype!: String
  body: any;

  cancelOrder(orderId: String) {
    this.deletiontype = 'order';
    // let body = { orderId };
    this.body = { orderId };
    let template: any = {
      title: 'Cancel Order',
      subtitle: 'Are you sure you want to cancel the order?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBoxService.confirmationDialogBox(this.template);


  }

  CancelProduct(id: any, product: any) {
    this.body = { id, product }
    this.deletiontype='product';
    this.template = {
      title: 'Cancel Ordered Product',
      subtitle: 'Are you sure you want to remove product from the order?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBoxService.confirmationDialogBox(this.template);

  }
}