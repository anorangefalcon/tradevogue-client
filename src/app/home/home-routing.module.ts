import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CollectionsComponent } from './collections/collections.component';
import { HeroComponent } from './hero/hero.component';
import { DealOfWeekComponent } from './deal-of-week/deal-of-week.component';

const routes: Routes = [
  // { path: 'home', component: HomeComponent},
  // { path: '',  pathMatch: 'full', redirectTo: 'home' },

  // { path: 'hero', component: HeroComponent},
  // { path: 'collections', component: CollectionsComponent},
  { path: 'deal', component: DealOfWeekComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
