import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';
import { ProductCardCarouselComponent } from './components/product-card-carousel/product-card-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SupportComponent } from './components/support/support.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { PopOpenDirective } from './Directives/pop-open.directive';
import { PopCloseDirective } from './Directives/pop-close.directive';
import { FooterComponent } from './components/footer/footer.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { HoverClickFocusDirective } from './Directives/hover-click-focus.directive';
import { UnhoverUnclickBlurDirective } from './Directives/unhover-unclick-blur.directive';

@NgModule({
  declarations: [
    NavbarComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    SupportComponent,
    PopOpenDirective,
    PopCloseDirective,
    FooterComponent,
    FacilitiesComponent,
    NewsletterComponent,
    HoverClickFocusDirective,
    UnhoverUnclickBlurDirective
  ],
  imports: [
    CommonModule,
    CarouselModule,
    MatTabsModule,
    RouterModule,
    // ProductPageModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    FacilitiesComponent,
    NewsletterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    SupportComponent,
    PopOpenDirective,
    PopCloseDirective,
    UnhoverUnclickBlurDirective,
    HoverClickFocusDirective,
  ]
})
export class SharedModule { }
