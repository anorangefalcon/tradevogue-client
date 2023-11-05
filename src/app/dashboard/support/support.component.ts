import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PopupService } from 'src/app/shared/services/popup.service';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';

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
    const url = this.utils.URLs.getTicketTitle;
    this.http.get(url).toPromise()
      .then((data: any) => {
        this.titleData = data[0].title;
        this.ticketTypeId = data[0]._id;
        console.log(this.titleData);
      })
      .catch(error => {
        console.error("Error loading data:", error);
      });
  }

  showItemDetails(item: any) {
    console.log(item)
    this.selectedItem = item;
    this.updatedItem = item;
    this.popupService.openPopup();
  }

  updateItem() {
    this.loadData()
    console.log(this.updatedItem, "updated");
    console.log(this.selectedItem, "selected");
    const body = {
      _id: this.ticketTypeId,
      oldTitle: this.selectedItem,
      newTitle: this.updatedItem
    }

    console.log(body);

    this.fetchDataService.httpPost(this.utils.URLs.updateTicketTitle, body)
      .then((response: any) => {
        if (response.success) {
          const updatedIndex = this.titleData.findIndex(title => title === this.selectedItem);
          if (updatedIndex !== -1) {
            this.titleData[updatedIndex] = this.updatedItem;
          }
          this.selectedItem = null;
        }
      })
      .catch(error => {
        console.error("Error updating item:", error);
      });
      this.loadData();
  }

  addNewItem() {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem
    }

    console.log(body);

    this.fetchDataService.httpPost(this.utils.URLs.addTitleToTicketType, body)
      .then((response: any) => {
        if (response.success) {
          this.titleData.push(this.updatedItem);
        }
      })
      .catch(error => {
        console.error("Error adding item:", error);
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
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      newTitle: this.updatedItem
    }

    this.fetchDataService.httpPost(this.utils.URLs.addTitleToTicketType, body)
      .then((response: any) => {
        if (response.success) {
          this.titleData.push(this.updatedItem);
        }
      })
      .catch(error => {
        console.error("Error pushing item:", error);
      });

      this.loadData()
  }

  deleteTicketTitle(item: any) {
    this.loadData()
    const body = {
      _id: this.ticketTypeId,
      title: item
    }

    this.fetchDataService.httpPost(this.utils.URLs.deleteTicketTitle, body)
      .then((response: any) => {
        if (response.success) {
          const deletedIndex = this.titleData.findIndex(title => title === item);
          if (deletedIndex !== -1) {
            this.titleData.splice(deletedIndex, 1);
          }
        }
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });

      this.loadData()
  }
}
