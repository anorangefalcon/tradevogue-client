import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable()
export class PaginationService {
  private currentPage: number = 1; 
  private pageSize: number = 10;
  private data: any[] = [];

  constructor(private http: HttpClient, private backendUrl: UtilsModule) {}
  
  // faq
  faq = this.backendUrl.URLs.getFaqData;

  getCurrentPage(): number {
    return this.currentPage;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  getData(): any[] {
    return this.data;
  }

  loadData(): Observable<any> {
    return this.http.get(`${this.faq}?page=${this.currentPage}&limit=${this.pageSize}`);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.data.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // paginateFrontend(data: any[], page: number, pageSize: number): any[] {
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
    
  //   return data.slice(startIndex, endIndex);
  // }

  // paginateBackend(endpoint: string, page: number, pageSize: number): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('pageSize', pageSize.toString());

  //   return this.http.get(endpoint, { params });
  // }
  
}
