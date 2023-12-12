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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomiseBannerComponent } from './customise-banner/customise-banner.component';
import { SelectLayoutComponent } from './select-layout/select-layout.component';
import { DealComponent } from './deal/deal.component';
import { SalesComponent } from './sales/sales.component';
import { NewsletterComponent } from 'src/app/home/newsletter/newsletter.component';
import { ImageTransformPipe } from 'src/app/shared/Pipe/image-transform.pipe';

const routes: Routes = [
  {
    path: '', component: EditHomeComponent,
    children: [
      { path: '', component: SelectLayoutComponent},
      { path: 'hero', component: CustomiseBannerComponent},
      { path: 'deal', component: DealComponent},
      { path: 'offers', component: SalesComponent},
    ]
  }
];

@NgModule({
  declarations: [
    EditHomeComponent,
    SelectLayoutComponent,
    CustomiseBannerComponent,
    DealComponent
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
    ImageTransformPipe,
    ReactiveFormsModule,
    NewsletterComponent,
    [RouterModule.forChild(routes)],
  ],
  exports: [RouterModule]
})

export class EditHomeModule { }
