import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardsComponent } from './components/product-cards/product-cards.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardsComponent
  ]
})
export class SharedModule { }
