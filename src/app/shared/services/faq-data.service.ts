import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqDataService {
  constructor(private http: HttpClient) {}

  getFaqData(): Observable<any[]> {
    return this.http.get<any[]>('../../../assets/tempDB/faq-data.json');
  }
}
