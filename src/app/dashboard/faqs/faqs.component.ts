import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FaqDataService } from 'src/app/shared/services/faq-data.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
  faqData: any = [];
  selectedOption: string = ''; 
  selectedCategory: any;
  pageSize: any = 3;
  currentPage: any = 1;

  limit: number = 10;

  constructor(private faq: FaqDataService) {
    this.faq.getFaqData(this.currentPage , this.limit).subscribe((data: any) => {
      this.faqData = data;
      console.log(this.faqData);
    });
  }

  retrieveContent() {
    console.log(this.selectedOption); 
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
  }
  


}