import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PopupService } from 'src/app/shared/services/popup.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { catchError, forkJoin } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  ticketData: any[] = [];
  selectedItem: any;
  editItem: boolean = false;
  selectedTicket: any = {
    title: '',
    body: '',
    icon: ''
  };
  updatedItem: string = '';
  ticketTypeId: string = '';
  isDrawerOpen: boolean = false;
  uniqueStatusValues: string[] = [];
  notificationForm: any;
  messageInput: string = '';
  token: any;

  constructor(private utils: UtilsModule, private http: HttpClient, private popupService: PopupService, private fetchDataService: FetchDataService, private formBuilder: FormBuilder, private cookie: CookieService) {
    this.loadData();


    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      icon: ['', Validators.required]
    });
  }

  loadData() {
    // const url = this.utils.URLs.getAllTicket;
    // this.http.get(url)
    //   .pipe(
    //     catchError((error) => {
    //       console.error("Error loading data:", error);
    //       throw error;
    //     })
    //   )
    //   .subscribe((data: any) => {
    //     console.log(data, "data is");
    //     this.processTicketData(data);
    //   });
    this.fetchDataService.HTTPGET(this.utils.URLs.getAllTicket).subscribe((data)=> {
      console.log(data, "data is ")
      this.processTicketData(data);
    })
  }

  private processTicketData(data: any): void {
    this.ticketData = data.map((item: any) => ({
      _id: item._id,
      ticketTitle: item.message,
      userName: item.userName,
      userEmail: item.userEmail,
      status: item.status,
      action: item.action,
      statusChangeable: [...new Set(item.TicketStatus[0]?.title.status || [])].map(String),
      ticketType: item.ticketTypes,
      notificationDetails: item.notificationDetails,
      dateCreated: new Date(item.dateCreated),
      userToken: this.findUserToken(item.userEmail),
    }));

    console.log(this.ticketData, "TICKET DATA")


    this.uniqueStatusValues = this.extractUniqueStatusValues(this.ticketData);
    this.ticketTypeId = data[0]._id;
  }

  findUserToken(userEmail: string): string | undefined {
    
    for (const item of this.ticketData) {
      console.log(item, "item is")
      if (item.notificationDetails) {
        for (const notification of item.notificationDetails) {
          const user = notification.tokenDetail.find((user: any) => user.email === userEmail);
          if (user) {
            const userToken = user.token;
            console.log(`Found token for email ${userEmail}: ${userToken}`);
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
    console.log(item)
    this.selectedItem = item;
    this.ticketTypeId = item._id;
    this.popupService.openPopup();
  }


  webPush(item: any) {
    this.selectedTicket = item;
    this.editItem = true;
    this.ticketTypeId = item._id;
    this.token = this.findUserToken(item.userEmail);
    console.log(item.userEmail, "token is", this.token)
  }


  updateItem() {
    // Prepare the data to send
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      status: this.selectedItem.status,
      email: this.selectedItem.userEmail,
      message: this.messageInput,
    };

    const url1 = this.utils.URLs.updateTicket;
    const url2 = this.utils.URLs.ticketMail;

    const request1 = this.fetchDataService.HTTPPOST(url1, body);
    const request2 = this.fetchDataService.HTTPPOST(url2, body).subscribe((res=> {
      console.log(res , "res is========> ")
    }));

    // Use forkJoin to send the requests in parallel
    forkJoin([request1, request2])
      .subscribe(
        ([response1]) => {
          if (response1) {
            const updatedIndex = this.ticketData
              .findIndex(title => title === this.selectedItem);
            if (updatedIndex !== -1) {
              this.ticketData
              [updatedIndex] = this.updatedItem;
            }
            this.selectedItem = null;
          }
        },
        (error) => {
          console.error('Error updating item:', error);
        }
      );
    this.loadData()
  }

  sendNotification() {


    if (this.notificationForm.valid) {
      // Create the data object with the desired structure
      const data = {
        title: this.notificationForm.value.title,
        body: this.notificationForm.value.body,
        icon: this.notificationForm.value.icon,
        token: this.cookie.get('fcmToken'),
      };
      this.cookie.set('fcmToken', this.token)
      const fcmToken = this.token;

      const apiUrl = 'http://localhost:3000/send-notification';

      this.http.post(apiUrl, data).subscribe(
        (response) => {
          console.log('Notification sent successfully:', response);
          // Reset the form and close the popup
          this.notificationForm.reset();
          this.selectedTicket = {};
        },
        (error) => {
          console.error('Error sending notification:', error);
        }
      );
    }
  }



  // updateItem() {
  //   this.loadData()
  //   const body = {
  //     _id: this.ticketTypeId,
  //     status: this.selectedItem.status,
  //     email: this.selectedItem.userEmail,
  //     message: this.messageInput
  //     };

  //   console.log(body);

  //   this.fetchDataService.httpPost(this.utils.URLs.updateTicketStatus, body)
  //     .then((response: any) => {
  //       if (response.success) {
  //         const updatedIndex = this.ticketData
  //     .findIndex(title => title === this.selectedItem);
  //         if (updatedIndex !== -1) {
  //           this.ticketData
  //       [updatedIndex] = this.updatedItem;
  //         }
  //         this.selectedItem = null;
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Error updating item:", error);
  //     });
  //     this.loadData();
  // }

  addNewItem() {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem
    }

    console.log(body);

    this.fetchDataService.HTTPPOST(this.utils.URLs.addTicketTitle, body)
      .subscribe((response: any) => {
        if (response.success) {
          this.ticketData
            .push(this.updatedItem);
        }
      })
      

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
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem
    }

    this.fetchDataService.HTTPPOST(this.utils.URLs.addTicketTitle, body)
      .subscribe((response: any) => {
        if (response.success) {
          this.ticketData
            .push(this.updatedItem);
        }
      })
     

    this.loadData()
  }

  deleteTicketTitle(item: any) {
    this.loadData()
    const body = {
      _id: this.ticketTypeId
    }

    this.fetchDataService.HTTPPOST(this.utils.URLs.deleteTicket, body)
      .subscribe((response: any) => {
        if (response.success) {
          const deletedIndex = this.ticketData
            .findIndex(title => title === item);
          if (deletedIndex !== -1) {
            this.ticketData
              .splice(deletedIndex, 1);
          }
        }
      })
     

    this.loadData()
  }
}
