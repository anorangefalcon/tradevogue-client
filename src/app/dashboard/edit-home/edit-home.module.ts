import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHomeComponent } from './edit-home.component';
import { RouterModule, Routes } from '@angular/router';
import { HeroComponent } from 'src/app/home/hero/hero.component';
import { GalleryComponent } from 'src/app/home/gallery/gallery.component';
import { CollectionsComponent } from 'src/app/home/collections/collections.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DealOfWeekComponent } from 'src/app/home/deal-of-week/deal-of-week.component';
import { OffersComponent } from 'src/app/home/offers/offers.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: EditHomeComponent,
    // children: [

    // ]
  }
];

@NgModule({
  declarations: [
    EditHomeComponent
  ],
  imports: [
    CommonModule,
    HeroComponent,
    GalleryComponent,
    DealOfWeekComponent,
    CollectionsComponent,
    SharedModule,
    OffersComponent,
    FormsModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [RouterModule]
})

export class EditHomeModule { }
