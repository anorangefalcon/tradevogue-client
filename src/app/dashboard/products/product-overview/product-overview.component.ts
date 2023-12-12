import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.css']
})
export class ProductOverviewComponent {
  productDetails!: any;
  skuId!: string;

  constructor(private activeRoute: ActivatedRoute, private backendUrl: UtilsModule, private fetchService: FetchDataService){
    
    activeRoute.params.subscribe({
      next: async (data)=>{
        this.skuId = data['sku'];
      }
    });
  }

}
