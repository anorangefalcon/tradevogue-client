import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';
import { ProductCardCarouselComponent } from './components/product-card-carousel/product-card-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MailBarComponent } from './mail-bar/mail-bar.component';
import { SupportComponent } from './components/support/support.component';
import { MatTabsModule } from '@angular/material/tabs';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    MailBarComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    MatTabsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    SupportComponent
  ]
})
export class SharedModule { }
