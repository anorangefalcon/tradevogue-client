import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private apiUrl = this.util.URLs.getPincode;

  constructor(private http: HttpClient,
    private util: UtilsModule) { }

  getDetailsByPostalCode(postalCode: string): Observable<any> {
    const url = `${this.apiUrl}?postalCode=${postalCode}`;
    return this.http.get(url);
  }
}