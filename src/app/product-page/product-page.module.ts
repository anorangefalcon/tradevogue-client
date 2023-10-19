import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ProductPageComponent },
];

@NgModule({
  declarations: [
    ProductPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    CarouselModule,
  ],
  exports: [
  ]
})
export class ProductPageModule { }
