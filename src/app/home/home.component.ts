import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UtilsModule } from '../utils/backend-urls';
import { FetchDataService } from '../shared/services/fetch-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('hero') hero!: TemplateRef<any>;
  @ViewChild('collection') collection!: TemplateRef<any>;
  @ViewChild('deal') deal!: TemplateRef<any>;
  @ViewChild('latestProducts') latestProducts!: TemplateRef<any>;
  @ViewChild('offers') offers!: TemplateRef<any>;
  @ViewChild('productCarousel') productCarousel!: TemplateRef<any>;
  @ViewChild('newsletter') newsletter!: TemplateRef<any>;

  layout: any[] = [];

  loading: Boolean = false;
  theme: Boolean = false;

  constructor(
    private backendUrls: UtilsModule, private fetchDataService: FetchDataService) {
    (<HTMLMetaElement>document.getElementById('meta-description')).content = "TradeVogue"
  }

  ngOnInit() {
    this.loading = true;
    this.fetchDataService.HTTPGET(this.backendUrls.URLs.getHomeLayout)
      .subscribe((data: any) => {
        this.layout = (data.layout).filter((item: any) => item.active);
        this.loading = false;
      });

    this.fetchDataService.themeColor$.subscribe((color) => {
      this.theme = color;
    })

  }

  getTemplate(item: string): TemplateRef<any> {
    switch (item) {
      case 'hero':
        return this.hero;
      case 'collection':
        return this.collection;
      case 'deal':
        return this.deal;
      case 'latestProducts':
        return this.latestProducts;
      case 'offers':
        return this.offers;
      case 'productCarousel':
        return this.productCarousel;
        case 'newsletter':
        return this.newsletter;
      default:
        return null!;
    }
  }
}