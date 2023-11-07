import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';
import { ProductCardCarouselComponent } from './components/product-card-carousel/product-card-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SupportComponent } from './components/support/support.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductFilterPipe } from './Pipe/product-filter.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddressComponent } from './address/address.component';
import { LessThanOrEqualPipe } from './Pipe/less-than-or-equal.pipe';
import { PopUpComponent } from './pop-up/pop-up.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { InvoiceTemplateComponent } from './components/invoice-template/invoice-template.component';
import { GalleryComponent } from '../home/gallery/gallery.component';
import { HeroComponent } from '../home/hero/hero.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    SupportComponent,
    FooterComponent,
    CustomSelectComponent,
    ProductFilterPipe,
    AddressComponent,
    LessThanOrEqualPipe,
    PopUpComponent,
    LessThanOrEqualPipe,
    PaginationComponent,
    DrawerComponent,
    InvoiceTemplateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    MatTabsModule,
    MatExpansionModule,
    RouterModule,
    FormsModule,
    GalleryComponent,
    HeroComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent,
    ProductCardCarouselComponent,
    CardTemplateComponent,
    SearchBarComponent,
    SupportComponent,
    ProductFilterPipe,
    CustomSelectComponent,
    AddressComponent,
    LessThanOrEqualPipe,
    PopUpComponent,
    LessThanOrEqualPipe,
    PaginationComponent,
    DrawerComponent,
  ],

})
export class SharedModule { }
