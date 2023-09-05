import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AboutPageComponent } from './about-page.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AboutPageComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    BrowserAnimationsModule
  ]
})
export class AboutPageModule {}
