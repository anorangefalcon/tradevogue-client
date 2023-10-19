import { Component, OnInit } from '@angular/core';
import { FaqDataService } from '../shared/services/faq-data.service'; 

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent implements OnInit {
  faqData: any[] = [];
  page= 1;
  limit = 100;

  constructor(private faqDataService: FaqDataService) {}

  ngOnInit(): void {
    this.faqDataService.getFaqData(this.page , this.limit).subscribe((data) => {
      this.faqData = data.filter((section) => Object.keys(section).length > 0);

      this.faqData.forEach(section => {
        section.expanded = false;
        section.childrens.forEach((child: { expanded: boolean; }) => {
          child.expanded = false;
        });
      });
    });

    const allSkeleton = document.querySelectorAll('.skeleton');

    if(allSkeleton) {
      allSkeleton.forEach((item: Element) => {
        item.classList.remove('skeleton');
      });
    }

   window.addEventListener('load', () => {
      allSkeleton.forEach((item: Element) => {
        item.classList.remove('skeleton');
      });
    });
  }

  toggleSection(section: any): void {
    section.expanded = !section.expanded;
  }

  toggleChild(child: any): void {
    child.expanded = !child.expanded;
    console.log("child is ", child.expanded);
  }
}
