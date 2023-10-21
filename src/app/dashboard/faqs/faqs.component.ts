import { Component, HostListener, provideZoneChangeDetection } from '@angular/core';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
})
export class FaqsComponent {
  faqData: any[] = [];
  selectedOption: string = '';
  faqForm!: FormGroup;
  selectedCategory: any;
  showPopup: boolean = false;
  editItem: boolean = false;
  isSlideIn = false;
  selectedItem: any;
  isMenuActive = false;
  isDrawerOpen: boolean = false;
  pageSize: number = 3;
  currentPage: number = 1;


  constructor(public pagination: PaginationService, private formBuilder: FormBuilder, private bgURL: UtilsModule, private fetchDataService: FetchDataService, private popupService: PopupService, private fb: FormBuilder) {
    this.loadData();
  }

  ngOnInit(): void {
    this.faqForm = this.formBuilder.group({
      selectedOption: ['', Validators.required],
      query: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ]
    });
  }

  loadData() {
    this.pagination.paginateBackend(`${this.bgURL.URLs.getPaginatedData}/faq`, this.currentPage, this.pageSize).subscribe((data) => {
      this.faqData = data;
    });
    this.paginateData();
  }

  paginateData() {
    this.pagination.paginateFrontend(this.faqData, this.currentPage, this.pageSize);
  }

  retrieveContent() {
    console.log(this.selectedOption);
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
  }

  nextPage() {
    if (this.currentPage * this.pageSize <= this.faqData.length) {
      this.currentPage++;
      this.loadData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  async addCategory() {
    if (this.faqForm.valid) {
      const selectedCategoryId = this.faqForm.get('selectedOption')?.value;
      const query = this.faqForm.get('query')?.value;
      const content = this.faqForm.get('content')?.value;

      const dataToSend = {
        title: selectedCategoryId,
        children: [
          {
            title: query,
            content: content,
            expanded: false,
          },
        ],
      };

      await this.fetchDataService.httpPost(this.bgURL.URLs.addFaqData, dataToSend)

      console.log(selectedCategoryId, query, content);
      this.faqForm.reset();
    }
  }

  showItemDetails(item: any) {
    this.selectedItem = item;
    this.popupService.openPopup();
    // this.showPopup = true;
  }

  showEdit(item: any) {
    this.selectedItem = item;
    this.editItem = true;
    this.faqForm.patchValue({
      query: this.selectedItem.title,
      content: this.selectedItem.content,
    });
  }

  async updateDetails() {
    if (this.selectedItem) {
      const updatedItem = { ...this.selectedItem };
      console.log("updated items ", updatedItem)

      updatedItem.query = this.faqForm.get('query')?.value;
      updatedItem.content = this.faqForm.get('content')?.value;

      const itemIndex = this.selectedCategory.childrens.findIndex((child: any) => child._id === updatedItem._id);

      if (itemIndex !== -1) {
        this.selectedCategory.childrens[itemIndex] = updatedItem;
      }

      try {
        const data = await this.fetchDataService.httpPost(this.bgURL.URLs.updateFaqData, updatedItem);
        console.log("Item updated successfully.", data);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    }
  }

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }


  async deleteFaq(item: any) {
    this.selectedItem = item;
    if (this.selectedItem) {
      const itemId = item._id;

      const itemIndex = this.selectedCategory.childrens.findIndex((child: any) => child._id === itemId);
      if (itemIndex !== -1) {
        this.selectedCategory.childrens.splice(itemIndex, 1);
      }

      try {
        const data = await this.fetchDataService.httpPost(this.bgURL.URLs.deleteFaqData, { _id: itemId });
        console.log("Item deleted successfully.", data);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
}


