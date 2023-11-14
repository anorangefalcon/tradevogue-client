import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PopupService } from 'src/app/shared/services/popup.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  titleData: string[] = [];
  selectedItem: any;
  updatedItem: string = '';
  ticketTypeId: string = '';
  isDrawerOpen: boolean = false;

  constructor(private utils: UtilsModule, private http: HttpClient, private popupService: PopupService, private fetchDataService: FetchDataService) {
    this.loadData();
  }

  loadData() {
    const url = this.utils.URLs.getTicketStatus;
    this.http.get(url).toPromise()
      .then((data: any) => {
        this.titleData = data[0].title;
        this.ticketTypeId = data[0]._id;
      })
      .catch(error => {
      });
  }

  showItemDetails(item: any) {
    this.selectedItem = item;
    this.updatedItem = item;
    this.popupService.openPopup();
  }

  updateItem() {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      oldTitle: this.selectedItem,
      newTitle: this.updatedItem
    }

    this.fetchDataService.HTTPPOST(this.utils.URLs.updateTitle, body)
      .subscribe((response: any) => {
        if (response.success) {
          const updatedIndex = this.titleData.findIndex(title => title === this.selectedItem);
          if (updatedIndex !== -1) {
            this.titleData[updatedIndex] = this.updatedItem;
          }
          this.selectedItem = null;
        }
      })
     
      this.loadData();
  }

  addNewItem() {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem
    }

    this.fetchDataService.HTTPPOST(this.utils.URLs.addTicketTitle, body)
      .subscribe((response: any) => {
        if (response.success) {
          this.titleData.push(this.updatedItem);
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
          this.titleData.push(this.updatedItem);
        }
      })
      this.loadData()
  }

  deleteTicketTitle(item: any) {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      title: item
    }

    this.fetchDataService.HTTPPOST(this.utils.URLs.deleteTitle, body)
      .subscribe((response: any) => {
        if (response.success) {
          const deletedIndex = this.titleData.findIndex(title => title === item);
          if (deletedIndex !== -1) {
            this.titleData.splice(deletedIndex, 1);
          }
        }
      })
      

      this.loadData()
  }
}
