import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class FaqDataService {
  constructor(private http: HttpClient, private util : UtilsModule) {}

  getFaqData(): Observable<any[]> {
    return this.http.get<any[]>(this.util.URLs.getFaqData);
  }
}
