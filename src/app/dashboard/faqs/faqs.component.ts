import { Component } from '@angular/core';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Subscription } from 'rxjs';

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
  faq: any[] = [];
  objectvalues = Object.values;
  selectedOption: string = '';
  faqForm!: FormGroup;
  allSubscriptions: Subscription[] = [];
  editForm!: FormGroup;
  selectedCategory: { title: string; childrens: any[] } = { title: '', childrens: [] };
  showPopup: boolean = false;
  editItem: boolean = false;
  isSlideIn = false;
  selectedItem: any;
  isMenuActive = false;
  isDrawerOpen: boolean = false;
  pageSize: number = 5;
  show: boolean = false;
  direction: string = 'right';
  currentPage: number = 1;
  popUpDirection: any = 'popup';
  showingPopUp: boolean = false;

  constructor(private toast: ToastService,
    public pagination: PaginationService,
    private fb: FormBuilder,
    private bgURL: UtilsModule,
    private fetchDataService: FetchDataService,
    private popupService: PopupService) {
    this.loadData();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.faqForm = this.fb.group({
      categories: this.fb.array([this.createCategory()]),
    });

    this.editForm = this.fb.group({
      selectedOption: ['', Validators.required],
      query: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ]
    });

  }

  createCategory(): FormGroup {
    return this.fb.group({
      selectedOption: ['', Validators.required],
      query: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
    });
  }

  get categoryForms() {
    if (this.faqForm && this.faqForm.get('categories') instanceof FormArray) {
      return (this.faqForm.get('categories') as FormArray).controls;
    }
    return [];
  }

  addFaqCategory() {
    if (this.faqForm && this.faqForm.get('categories')) {
      (this.faqForm.get('categories') as FormArray).push(this.createCategory());
    }
  }

  removeCategory(index: number) {
    if (this.faqForm && this.faqForm.get('categories')) {
      (this.faqForm.get('categories') as FormArray).removeAt(index);
    }
  }

  loadData() {
    this.pagination.paginateBackend(`${this.bgURL.URLs.getPaginatedData}/faq`, this.currentPage, this.pageSize).subscribe((data) => {
      this.faqData = data;
      this.faq = this.faqData.map((name) => {
        return name.title
      });

      this.retrieveContent(this.faq[0])
    });
  }

  retrieveContent(selectedOption: any) {
    this.selectedOption = this.faqData.find((category: any) => category.title === selectedOption).title;
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
  }

  updateFormFields(event: any) {

  }

  PopUpChangeHanlder(event: any) {
    this.showingPopUp = event;
  }


  // async addCategory() {
  //   console.log(this.faqForm.value);
  //   if (this.faqForm.valid) {
  //     const selectedCategoryId = this.faqForm.get('selectedOption')?.value;
  //     const query = this.faqForm.get('query')?.value;
  //     const content = this.faqForm.get('content')?.value;

  //     const dataToSend = {
  //       title: selectedCategoryId,
  //       children: [
  //         {
  //           title: query,
  //           content: content,
  //           expanded: false,
  //         },
  //       ],
  //     };

  //    this.fetchDataService.HTTPPOST(this.bgURL.URLs.addFaqData, dataToSend).subscribe((data) => {
  //       if (data) {
  //         this.toast.successToast({ title: "FAQ added successfully" });
  //       } else {
  //         this.toast.errorToast({ title: "FAQ not added" });
  //       }
  //       this.showingPopUp = false;
  //       this.loadData();
  //     });
  //     this.faqForm.reset();
  //   }
  // }

  saveCategory(index: number, event: any) {
    this.faqForm.get('categories')?.get(`${index}`)?.get('selectedOption')?.patchValue(event);
  }

  async addCategory() {

    const categoriesControl = this.faqForm.get('categories');
    console.log(this.faqForm);

    if (categoriesControl && categoriesControl.value && this.faqForm.valid) {
      const categoriesToSend: any = [];

      categoriesControl.value.forEach((category: any) => {
        const selectedCategoryId = category.selectedOption;
        const query = category.query;
        const content = category.content;

        const categoryObj = {
          title: selectedCategoryId,
          children: [
            {
              title: query,
              content: content,
              expanded: false,
            },
          ],
        };
        categoriesToSend.push(categoryObj);
      });

      const dataToSend = {
        categories: categoriesToSend,
      };

      console.log(dataToSend);

      this.fetchDataService.HTTPPOST(this.bgURL.URLs.addFaqData, dataToSend).subscribe((data) => {
        if (data) {
          this.toast.successToast({ title: "FAQs added successfully" });
          console.log('updated come is ', this.showingPopUp);

          this.show = false;
          this.loadData();
        } else {
          this.toast.errorToast({ title: "FAQs not added" });
        }
      });
      this.faqForm.reset();
    }
  }

  showItemDetails(item: any) {
    this.selectedItem = item;
    this.showingPopUp = true;
  }

  showEdit(item: any) {
    this.selectedItem = item;
    this.editItem = true;
    console.log(this.selectedItem);
    if (this.editForm) {
      this.editForm.patchValue({
        query: this.selectedItem.title,
        content: this.selectedItem.content,
      });
    }
  }

  async updateDetails() {
    if (this.selectedItem) {
      const updatedItem = { ...this.selectedItem };

      console.log(updatedItem);

      updatedItem.query = this.editForm.get('query')?.value;
      updatedItem.content = this.editForm.get('content')?.value;

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
        const data: any = this.fetchDataService.HTTPPOST(this.bgURL.URLs.updateFaqData, updatedFaqItem).subscribe((res) => {
          this.loadData();
        });
        if (data) {
          this.toast.successToast({ title: "FAQ updated successfully" });
        } else {
          this.toast.errorToast({ title: "FAQ not updated" });
        }
      } catch (error) {
      }
    }
  }

  openDrawer() {
    this.show = true;
  }

  ChangeHandler(event: boolean) {
    this.show = event;
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
        const data = this.fetchDataService.HTTPPOST(this.bgURL.URLs.deleteFaqData, { _id: itemId }).subscribe((res) => {
          this.loadData();
        });
        if (data) {
          this.toast.successToast({ title: 'FAQ deleted successfully' });
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
  }

  tableGenerator(len: number) {
    let temp = []
    for (let i = 0; i < len; i++) {
      temp.push(0);
    }
    return temp;
  }
}


