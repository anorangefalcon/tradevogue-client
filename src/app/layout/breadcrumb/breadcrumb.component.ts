import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/' || this.router.url === '') {
          this.breadcrumbs = [];
        } else {
          this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        }
        this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
        console.log('Navigation has ended:', event.url);
      }
    });
  }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const snapshot = route.snapshot;
    console.log('snapshot', snapshot);

    const breadcrumbLabel: string = snapshot.data['breadcrumb'];

    console.log('breadcrumbLabel', breadcrumbLabel);


    const routeURL: string = snapshot.url.map((segment) => segment.path).join('/');
    if (routeURL !== '') {
      url += `/${routeURL}`;
    }
    console.log('routeURL', routeURL);

    if (breadcrumbLabel) {
      breadcrumbs.push({ label: breadcrumbLabel, url });
    }

    // Recursion
    if (route.children.length > 0) {
      return this.createBreadcrumbs(route.children[0], url, breadcrumbs);
    }
    return breadcrumbs;
  }

}
