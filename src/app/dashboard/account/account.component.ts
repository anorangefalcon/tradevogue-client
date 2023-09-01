import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  formChange: boolean = false;

  changeForm(){
    console.log(this.formChange);
    this.formChange = !this.formChange;
  }
}
