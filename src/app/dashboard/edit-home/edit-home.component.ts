import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.css'],
  encapsulation: ViewEncapsulation.Emulated

})

export class EditHomeComponent {


  layoutObj: any = {
    html: '<app-hero></app-hero>'
  }

  @ViewChild('hero') hero!: TemplateRef<any>;
  @ViewChild('collection') collection!: TemplateRef<any>;
  @ViewChild('deal') deal!: TemplateRef<any>;
  @ViewChild('latestProducts') latestProducts!: TemplateRef<any>;
  @ViewChild('offers') offers!: TemplateRef<any>;
  @ViewChild('productCarousel') productCarousel!: TemplateRef<any>;

  Direction: any[] = ['hero', 'collection', 'deal', 'latestProducts', 'offers', 'productCarousel']

  clickedAt: String = '';

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
      default:
        return null!;
    }
  }

  onItemClick(item: any): void {
    // Your click event logic here
    console.log('Item clicked:', item);
    this.clickedAt = item;
  }

  
}
