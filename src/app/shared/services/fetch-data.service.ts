import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl='../../../assets/tempDB/usersData.json'
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.url);
  }

  getUserData() {
    // let x;
    //  const x=this.http.get(this.userUrl).toPromise();

     return this.http.get(this.userUrl);
      
    
  }




  //  CHANGE FILTER DATA

  data = new BehaviorSubject<any>({});
  // actual data lies here
  cart$ = this.data.asObservable();



}
