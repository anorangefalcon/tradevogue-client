import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {

  @Input() product: any = {};

  avgRating: number = 0;
  offerPercentage: number = 0;

  ngOnInit(): void {
    for (let review of this.product.reviews) {
      this.avgRating += review.rating;
    }
    this.avgRating = this.avgRating / this.product.reviews.length;
    if (this.product.oldPrice !== (undefined || 0)) {
      this.offerPercentage = Math.floor((this.product.oldPrice- this.product.price) / this.product.oldPrice * 100);
    }
  }

  createArrayToIterate(num: number){
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }
    
}
