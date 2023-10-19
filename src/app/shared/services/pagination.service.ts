import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';

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

  setLimit(limit: number): void {
    this.pageSize = limit;
  }

  getLimit(): number {
    return this.pageSize;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
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
}
