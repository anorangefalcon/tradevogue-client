import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private apiUrl = 'http://24.199.90.170:5000/api/purchaser/getDetailsByPostalCode';

  constructor(private http: HttpClient) { }

  getDetailsByPostalCode(postalCode: string): Observable<any> {
    const url = `${this.apiUrl}?postalCode=${postalCode}`;
    return this.http.get(url);
  }
}