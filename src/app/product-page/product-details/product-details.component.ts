import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  productDetails: any = {};
  avgRating: number = 0;
  checkSelect: boolean = false;
  offerPercentage: number = 0;
  currentCustomSelect: any;
  addReview: boolean = false;

  selectedSection = 'description';

  constructor(
    private route: ActivatedRoute,
    private fetchService: FetchDataService
  ) { }

  ngOnInit(): void {
    this.productDetails.info = [];
    this.productDetails.reviews = [];
    

    this.route.params.subscribe(params => {
      const sku = params['sku'];

      this.fetchService.getData().subscribe((data: any[]) => {
        this.productDetails = data.find((item) => {
          return item['sku'] === sku;
        });
        this.avgRating = 0;
        for (let i = 0; i < (this.productDetails.reviews).length; i++) {
          this.avgRating += this.productDetails.reviews[i].rating;
        }
        this.avgRating = this.avgRating / this.productDetails.reviews.length;
        if (this.productDetails.oldPrice !== (undefined || 0)) {
          this.offerPercentage = Math.floor((this.productDetails.oldPrice - this.productDetails.price) / this.productDetails.oldPrice * 100);
        }
      });
    });
  }
}
