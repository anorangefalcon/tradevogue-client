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

  tempUserRating: number = -1;
  userRating: number = -1;
  
  constructor() {}

  ngOnInit(): void {}

  createArrayToIterate(num: number) {
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }
}
