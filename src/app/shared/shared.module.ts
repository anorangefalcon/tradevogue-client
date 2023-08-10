import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';
import { ProductCardCarouselComponent } from './components/product-card-carousel/product-card-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardTemplateComponent } from './components/card-template/card-template.component';




@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent
  ]
})
export class SharedModule { }
