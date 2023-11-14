import { Component } from '@angular/core';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ToastService } from 'src/app/shared/services/toast.service';

interface FaqItem {
  _id: string;
  title: string;
  content: string;
  expanded: boolean;
}

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
})
export class FaqsComponent {
  faqData: any[] = [];
  selectedOption: string = '';
  faqForm!: FormGroup;
  selectedCategory: { title: string; childrens: any[] } = { title: '', childrens: [] };
  showPopup: boolean = false;
  editItem: boolean = false;
  isSlideIn = false;
  selectedItem: any;
  isMenuActive = false;
  isDrawerOpen: boolean = false;
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private toast: ToastService, public pagination: PaginationService, private formBuilder: FormBuilder, private bgURL: UtilsModule, private fetchDataService: FetchDataService, private popupService: PopupService) {
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
  }

  retrieveContent() {
    console.log(this.selectedOption);
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
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

      await this.fetchDataService.HTTPPOST(this.bgURL.URLs.addFaqData, dataToSend).subscribe((data) => {
        if (data) {
          this.toast.successToast({ title: "FAQ added successfully" });
        } else {
          this.toast.errorToast({ title: "FAQ not added" });
        }
        console.log("data", data);
        this.loadData();
      });

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

      const updatedFaqItem: FaqItem = {
        _id: updatedItem._id,
        title: updatedItem.query,
        content: updatedItem.content,
        expanded: updatedItem.expanded,
      };

      try {
        const data: any = await this.fetchDataService.HTTPPOST(this.bgURL.URLs.updateFaqData, updatedFaqItem);
        if (data) {
          this.toast.successToast({ title: "FAQ updated successfully" });
        } else {
          this.toast.errorToast({ title: "FAQ not updated" });
        }
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


  async deleteFaq(item: FaqItem) {
    this.selectedItem = item;
    if (this.selectedItem) {
      const itemId = item._id;

      const itemIndex = this.selectedCategory.childrens.findIndex((child: FaqItem) => child._id === itemId);
      if (itemIndex !== -1) {
        this.selectedCategory.childrens.splice(itemIndex, 1);
      }

      try {
        const data = await this.fetchDataService.HTTPPOST(this.bgURL.URLs.deleteFaqData, { _id: itemId }).toPromise();
        if (data) {
          this.toast.successToast({ title: 'FAQ deleted successfully' });
          this.loadData();
        } else {
          this.toast.errorToast({ title: 'FAQ not deleted' });
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadData();
  }
}


