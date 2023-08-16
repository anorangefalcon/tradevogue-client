import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutPageComponent } from './about-page.component';
// import { CarouselModule } from 'ngx-owl-carousel-o'; 
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [
    AboutPageComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ]
})
export class AboutPageModule { }
