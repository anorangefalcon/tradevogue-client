import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from './services/review.service';

const routes: Routes = [
  { path: '', component: ProductPageComponent },
];

@NgModule({
  declarations: [
    ProductPageComponent,
  ],
  providers: [
    ReviewService
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    CarouselModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class ProductPageModule { }
