import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs: Array<{ label: string, url: string }> = [];

  setBreadcrumbs(breadcrumbs: Array<{ label: string, url: string }>): void {
    this.breadcrumbs = breadcrumbs;
  }

  getBreadcrumbs(): Array<{ label: string, url: string }> {
    return this.breadcrumbs;
  }
}
