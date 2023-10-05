import { Component, OnInit } from '@angular/core';
import { FaqDataService } from '../shared/services/faq-data.service'; 

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent implements OnInit {
  faqData: any[] = [];

  constructor(private faqDataService: FaqDataService) {}

  ngOnInit(): void {
    this.faqDataService.getFaqData().subscribe((data) => {
      this.faqData = data;

      this.faqData.forEach(section => {
        section.expanded = false;
        section.childrens.forEach((child: { expanded: boolean; }) => {
          child.expanded = false;
        });
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
