import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';
import { ProductCardCarouselComponent } from './components/product-card-carousel/product-card-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SupportComponent } from './components/support/support.component';
// import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductFilterPipe } from './Pipe/product-filter.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddressComponent } from './address/address.component';
import { CartcontentComponent } from './cartcontent/cartcontent.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { LessThanOrEqualPipe } from './Pipe/less-than-or-equal.pipe';
import { PopUpComponent } from './pop-up/pop-up.component';


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
    CartcontentComponent,
    DialogComponent,
    LessThanOrEqualPipe,
    PopUpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    MatTabsModule,
    MatExpansionModule,
    RouterModule,
    FormsModule,
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
    CartcontentComponent,
    DialogComponent,
    LessThanOrEqualPipe,
    PopUpComponent
  ]
})
export class SharedModule { }
