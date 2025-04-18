import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { PopupService } from 'src/app/shared/services/popup.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent {
  ticketData: any[] = [];
  selectedItem: any;
  editItem: boolean = false;
  selectedTicket: any = {
    title: '',
    body: '',
    icon: '',
  };
  updatedItem: string = '';
  ticketTypeId: string = '';
  isDrawerOpen: boolean = false;
  uniqueStatusValues: string[] = [];
  notificationForm: any;
  messageInput: string = '';
  token: any;
  currentPage: number = 1;

  constructor(
    private utils: UtilsModule,
    private http: HttpClient,
    private popupService: PopupService,
    private fetchDataService: FetchDataService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private userService: LoginCheckService,
    private dialogService: DialogBoxService
  ) {
    this.loadData();

    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      icon: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUser('fcm').subscribe((token: any) => {
      this.token = token;
    });
    this.pageChange(this.currentPage);
  }

  updateFields(event: any) {
    if (!event) {
      this.pageChange(1);
      return;
    }
    this.pageChange(1, event);
  }

  pageChange(pageNo: any, searchWord: string = '') {
    this.TemplatePagination.currentPage = pageNo;
    this.TemplatePagination.search = searchWord;
    console.log(this.TemplatePagination);

    this.fetchDataService
      .HTTPGET(this.utils.URLs.getAllTicket, this.TemplatePagination)
      .subscribe((data) => {
        this.processTicketData(data);
        console.log(data);
      });
  }

  TemplatePagination: any = {
    search: '',
    currentPage: this.currentPage,
    limit: 10,
  };

  updateFormFields(field: string) {
    this.selectedItem.status = field;
    this.notificationForm.get('title')?.patchValue(field);
  }

  loadData() {
    this.fetchDataService
      .HTTPGET(this.utils.URLs.getAllTicket)
      .subscribe((data) => {
        this.processTicketData(data);
      });
  }

  private processTicketData(data: any): void {
    this.ticketData = data.map((item: any) => ({
      _id: item._id,
      ticketTitle: item.message,
      userName: item.userName,
      userEmail: item.userEmail,
      status: item.status,
      action: item.action,
      statusChangeable: [
        ...new Set(item.TicketStatus[0]?.title.status || []),
      ].map(String),
      ticketType: item.ticketTypes,
      notificationDetails: item.notificationDetails,
      dateCreated: new Date(item.dateCreated),
      userToken: this.findUserToken(item.userEmail),
    }));
    this.uniqueStatusValues = this.extractUniqueStatusValues(this.ticketData);
    this.ticketTypeId = data[0]._id;
  }

  findUserToken(userEmail: string): string | undefined {
    for (const item of this.ticketData) {
      if (item.notificationDetails) {
        for (const notification of item.notificationDetails) {
          const user = notification.tokenDetail.find(
            (user: any) => user.email === userEmail
          );
          if (user) {
            const userToken = user.token;
            return userToken;
          }
        }
      }
    }
    return undefined;
  }

  private extractUniqueStatusValues(ticketData: any[]): string[] {
    return Array.from(
      new Set(
        ticketData
          .map((item) => item.statusChangeable)
          .flat()
          .map(String)
      )
    );
  }

  showItemDetails(item: any) {
    this.selectedItem = item;
    this.ticketTypeId = item._id;
    this.popupService.openPopup();
  }

  webPush(item: any) {
    this.selectedTicket = item;
    this.editItem = true;
    this.ticketTypeId = item._id;
    this.token = this.findUserToken(item.userEmail);
  }

  updateItem() {
    // Prepare the data to send
    // this.loadData()
    const body = {
      _id: this.ticketTypeId,
      status: this.selectedItem.status,
      email: this.selectedItem.userEmail,
      message: this.messageInput,
    };

    const url1 = this.utils.URLs.updateTicket;
    const url2 = this.utils.URLs.ticketMail;

    const request1 = this.fetchDataService.HTTPPOST(url1, body);
    const request2 = this.fetchDataService
      .HTTPPOST(url2, body)
      .subscribe((res) => {
        this.dialogService.infoDialogBox({
          title: 'Status Changed to : ' + body.status,
          subtitle: 'Mail Sent to : ' + this.selectedItem.userEmail,
        });
        this.loadData();
        this.popupService.closePopup();
      });
    // Use forkJoin to send the requests in parallel
    forkJoin([request1, request2]).subscribe(
      ([response1]) => {
        if (response1) {
          const updatedIndex = this.ticketData.findIndex(
            (title) => title === this.selectedItem
          );
          if (updatedIndex !== -1) {
            this.ticketData[updatedIndex] = this.updatedItem;
          }
          this.selectedItem = null;
        }
      },
      (error) => {
        console.error('Error updating item:', error);
      }
    );
    // this.loadData()
  }

  sendNotification() {
    if (this.notificationForm.valid) {
      const data = {
        title: this.notificationForm.value.title,
        body: this.notificationForm.value.body,
        icon: this.notificationForm.value.icon,
        token: this.token,
      };
      this.userService.setFcmToken(this.token);
      const fcmToken = this.token;
      this.fetchDataService
        .HTTPPOST(this.utils.URLs.sendNotification, data)
        .subscribe((res) => {
          if (res) {
            this.toast.successToast({ title: 'Notification sent' });
            this.selectedTicket = {};
          }
        });
    }
  }

  addNewItem() {
    this.loadData();
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem,
    };

    this.fetchDataService
      .HTTPPOST(this.utils.URLs.addTicketTitle, body)
      .subscribe((response: any) => {
        if (response) {
          this.ticketData.push(this.updatedItem);
        }
      });

    this.loadData();
  }

  cancelUpdate() {
    this.selectedItem = null;
  }

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  pushItem() {
    this.loadData();
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem,
    };

    this.fetchDataService
      .HTTPPOST(this.utils.URLs.addTicketTitle, body)
      .subscribe((response: any) => {
        if (response) {
          this.ticketData.push(this.updatedItem);
        }
      });
    this.loadData();
  }

  deleteTicketTitle(item: any) {
    // console.log("clicked")
    this.loadData();
    const body = {
      _id: this.ticketTypeId,
    };

    this.fetchDataService
      .HTTPPOST(this.utils.URLs.deleteTicket, body)
      .subscribe((response: any) => {
        if (response) {
          this.toast.successToast({ title: 'Deleted Successfully' });
          const deletedIndex = this.ticketData.findIndex(
            (title) => title === item
          );
          if (deletedIndex !== -1) {
            this.ticketData.splice(deletedIndex, 1);
          }
        }
      });

    this.loadData();
  }
}
