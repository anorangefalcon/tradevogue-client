import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from '../shared/services/fetch-data.service';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit{
  data: any = {
    productDetails: {},
    avgRating: 0,
    checkSelect:false,
    offerPercentage: 0
  }

  constructor(
    private route: ActivatedRoute,
    private fetchService: FetchDataService
  ) { }

  ngOnInit(): void {
    this.data.productDetails.info = [];
    this.data.productDetails.reviews = [];


    this.route.params.subscribe(params => {
      const sku = params['sku'];
      
      this.fetchService.getData().subscribe((data: any[]) => {
        this.data.productDetails = data.find((item) => {
          return item['sku'] === sku;
        });
        this.data.avgRating = 0;
        for (let i = 0; i < (this.data.productDetails.reviews).length; i++) {
          this.data.avgRating += this.data.productDetails.reviews[i].rating;
        }
        this.data.avgRating = this.data.avgRating / this.data.productDetails.reviews.length;
        if (this.data.productDetails.oldPrice !== (undefined || 0)) {
          this.data.offerPercentage = Math.floor((this.data.productDetails.oldPrice - this.data.productDetails.price) / this.data.productDetails.oldPrice * 100);
        }
      });
    });
    
  }
  
}
