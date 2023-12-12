import { Component, OnInit } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/backend-urls';
@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent implements OnInit {
  faqData: any[] = [];
  page = 1;
  limit = 100;

  constructor(private fetch: FetchDataService,
    private util: UtilsModule) { }

  ngOnInit(): void {
    this.fetch.HTTPGET(this.util.URLs.getFaqData).subscribe((data: any) => {
      this.faqData = data.filter((section: {}) => Object.keys(section).length > 0);

      this.faqData.forEach(section => {
        section.expanded = false;
        section.childrens.forEach((child: { expanded: boolean; }) => {
          child.expanded = false;
        });
      });
    });
  }

  toggleParent(section: any): void {
    section.expanded = !section.expanded;
  }

  toggleChild(child: any): void {
    child.expanded = !child.expanded;
  }
}
