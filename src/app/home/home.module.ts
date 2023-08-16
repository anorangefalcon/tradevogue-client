import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { HeroComponent } from './hero/hero.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CollectionsComponent } from './collections/collections.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OffersComponent } from './offers/offers.component';
import { DealOfWeekComponent } from './deal-of-week/deal-of-week.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
];


@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    CollectionsComponent,
    GalleryComponent,
    OffersComponent,
    DealOfWeekComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    RouterModule.forChild(routes),
    CarouselModule
  ]
})
export class HomeModule { }
