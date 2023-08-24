import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  @Input () data:any = {};
  addReview: boolean = false;
  selectedSection = 'description';

  constructor() {}

  ngOnInit(): void {}
}
