import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http: HttpClient) {}

  paginateFrontend(data: any[], page: number, pageSize: number): any[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return data.slice(startIndex, endIndex);
  }

  paginateBackend(endpoint: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get(endpoint, { params });
  }
}