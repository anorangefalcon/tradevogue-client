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

  constructor(private faq: FaqDataService) {
    this.faq.getFaqData().subscribe((data: any) => {
      this.faqData = data;
      console.log(this.faqData);
    });
  }

  retrieveContent() {
    console.log(this.selectedOption); 
    this.selectedCategory = this.faqData.find((category: any) => category.title === this.selectedOption);
  }
}
