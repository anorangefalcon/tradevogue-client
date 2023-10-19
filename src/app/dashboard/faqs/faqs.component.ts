import { Component } from '@angular/core';
import { FaqDataService } from 'src/app/shared/services/faq-data.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

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
  pageSize: number = 3;
  currentPage: number = 1;
  limit: number = 10;
  showPopup: boolean = false;
  editItem: boolean = false;
  isSlideIn = false;
  selectedItem: any;


  constructor(private faq: FaqDataService, public pagination: PaginationService, private formBuilder: FormBuilder,private bgURL: UtilsModule, private fetchDataService: FetchDataService) {
    this.pagination.setLimit(this.pageSize);
    this.loadData();
  }

  ngOnInit(): void {
    this.faqForm = this.formBuilder.group({
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
    this.faq.getFaqData(this.currentPage, this.limit).subscribe((data: any) => {
      this.faqData = data;
      console.log(this.faqData , "faq data");
    });
  }

  retrieveContent() {
    console.log(this.selectedOption);
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.faqData.length) {
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

  showItemDetails(item: any) {
    this.selectedItem = item;
    this.showPopup = true;
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
      const updatedData = {
        _id: this.selectedItem._id, 
        query: this.faqForm.get('query')?.value,
        content: this.faqForm.get('content')?.value,
      };
      const data = await this.fetchDataService.httpPost(this.bgURL.URLs.updateFaqData, updatedData);
    }
}

deleteFaq(item: any) {
  this.selectedItem = item;
  if (this.selectedItem) {
    const updatedData = {
      _id: this.selectedItem._id, 
      query: this.faqForm.get('query')?.value,
      content: this.faqForm.get('content')?.value,
    };
    console.log(updatedData, "delete data")
    const data = this.fetchDataService.httpPost(this.bgURL.URLs.deleteFaqData, updatedData);
    console.log(data, "delete data")
  }
}



  
}


