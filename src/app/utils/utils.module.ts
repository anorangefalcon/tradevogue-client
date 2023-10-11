import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({

  imports: [
    CommonModule
  ]
})
export class UtilsModule {

  URLs:any={
    signupUrl:'http://localhost:5000/user/signup',
    getAddress:'http://localhost:5000/user/getAddress'
  }

 }

