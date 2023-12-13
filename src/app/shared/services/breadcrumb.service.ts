import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbs: Array<{ label: string; url: string }> = [];

  setBreadcrumbs(breadcrumbs: Array<{ label: string; url: string }>): void {
    this.breadcrumbs = breadcrumbs;
    localStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs));
  }

  getBreadcrumbs(): Array<{ label: string; url: string }> {
    const storedBreadcrumbs = localStorage.getItem('breadcrumbs');
    this.breadcrumbs = storedBreadcrumbs ? JSON.parse(storedBreadcrumbs) : [];
    return this.breadcrumbs;
  }
}
