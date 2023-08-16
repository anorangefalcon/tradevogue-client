import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqPageComponent } from './faq-page.component';
import { SharedModule } from '../shared/shared.module';
<<<<<<< Updated upstream
=======
import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   { path: 'faq', component: FaqPageComponent }
// ];
>>>>>>> Stashed changes

@NgModule({
  declarations: [
    FaqPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
<<<<<<< Updated upstream
=======
    // RouterModule.forChild(routes),

>>>>>>> Stashed changes
  ]
})
export class FaqPageModule { }
