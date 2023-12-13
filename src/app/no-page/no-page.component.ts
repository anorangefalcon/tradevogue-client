import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-no-page',
  templateUrl: './no-page.component.html',
  styleUrls: ['./no-page.component.css'],
})
export class NoPageComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
