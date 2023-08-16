import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductSectionComponent } from './product-section/product-section.component';


const routes: Routes = [
  { path: '', component: ProductPageComponent },
];

@NgModule({
  declarations: [
    ProductPageComponent,
    ProductSectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CarouselModule,
  ]
})
export class ProductPageModule { }
