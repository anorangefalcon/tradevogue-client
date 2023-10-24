import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable()
export class ReviewService {

  constructor(private http: HttpClient, private backendUrls: UtilsModule) { }

  addReview(data: any){    
    return this.http.post(this.backendUrls.URLs.addOrUpdateReview, data);
  }

  deleteReview(productId: any){
    let params = new HttpParams();
    params = params.set("productId", productId);
    return this.http.delete(this.backendUrls.URLs.deleteReview, { params });
  }
}
