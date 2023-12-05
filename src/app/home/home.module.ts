import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { CollectionsComponent } from './collections/collections.component';
import { OffersComponent } from './offers/offers.component';
import { DealOfWeekComponent } from './deal-of-week/deal-of-week.component';
import { HeroComponent } from './hero/hero.component';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
  declarations: [
    HomeComponent
    ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HeroComponent,
    GalleryComponent,
    CollectionsComponent,
    DealOfWeekComponent,
    OffersComponent
  ],
  exports: [
    GalleryComponent,
    DealOfWeekComponent
  ]
})
export class HomeModule { }
