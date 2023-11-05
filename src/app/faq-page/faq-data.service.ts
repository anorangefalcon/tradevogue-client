import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class FaqDataService {
  constructor(private http: HttpClient, private util : UtilsModule) {}

  getFaqData(page: any , limit: any): Observable<any[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any[]>(this.util.URLs.getFaqData , {params});
  }
}
