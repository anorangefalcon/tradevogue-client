import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Injectable()
export class ReviewService {

  constructor(private http: HttpClient, private backendUrls: UtilsModule, private fetchDataService:FetchDataService) { }

  addReview(data: any){    
    // console.log(data, 'kokokoko');
    
    return this.fetchDataService.HTTPPOST(this.backendUrls.URLs.addOrUpdateReview, data);
  }

  deleteReview(productId: any){
    let params = new HttpParams();
    params = params.set("productId", productId);
    return this.http.delete(this.backendUrls.URLs.deleteReview, { params });
  }
}
