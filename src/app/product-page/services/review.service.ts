import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable()
export class ReviewService {

  constructor(private http: HttpClient, private backendUrls: UtilsModule) { 
    
  }

  addReview(data: any){    
    console.log('data comingi is ',data);
    
    return this.http.post(this.backendUrls.URLs.addReview, data);
  }

  deleteReview(){

  }
}
