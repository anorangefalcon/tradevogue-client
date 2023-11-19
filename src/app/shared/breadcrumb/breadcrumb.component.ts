import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { SalesService } from '../services/custom-UI/sales.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];
  currentRoute: string = '';
  activeSku:any;
  saleData: any[] = [];
  marqueeData: string[] = [];
  marqueeDirection: string = 'left';
  private marqueeElement: HTMLMarqueeElement | undefined;

  // Function to pause the marquee
  pauseMarquee() {
    this.marqueeElement = document.querySelector('.marquee-container marquee') as HTMLMarqueeElement;
    if (this.marqueeElement) {
      this.marqueeElement.stop();
    }
  }

  // Function to resume the marquee
  resumeMarquee() {
    if (this.marqueeElement) {
      this.marqueeElement.start();
    }
  }
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private salesService: SalesService
  ) {
    this.router.events.subscribe((event) => {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url; 
        }
      });
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/' || this.router.url === '') {
          this.breadcrumbs = [];
        } else {
          this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        }

        this.breadcrumbService.setBreadcrumbs(this.breadcrumbs);
      }
    });
  }

  isHomePage(): boolean {
    return window.location.pathname === '/';
  }

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.getBreadcrumbs();
    this.salesService.getSales().subscribe((data: any) => {
      this.saleData = data.filter((item: any) => item.enable);
      // console.log(this.saleData, "sale data ")
      this.marqueeData = this.saleData.map((item: any) => item.title);
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const snapshot = route.snapshot;
    this.activeSku = route.snapshot.params['sku'];

    const breadcrumbLabel: string = snapshot.data['breadcrumb'];



    const routeURL: string = snapshot.url.map((segment) => segment.path).join('/');
    if (routeURL !== '') {
      url += `/${routeURL}`;
    }

    if (breadcrumbLabel) {
      breadcrumbs.push({ label: breadcrumbLabel, url });
    }

    // if (breadcrumbLabel === 'Product' && this.activeSku) {
    //   const existingSkuIndex = breadcrumbs.findIndex((item) => item.label === this.activeSku);
    //   if (existingSkuIndex === -1) {
    //     breadcrumbs.push({ label: this.activeSku, url });
    //   } else {
    //     breadcrumbs[existingSkuIndex].url = url;
    //   }
    // }

    // Recursion
    if (route.children.length > 0) {
      return this.createBreadcrumbs(route.children[0], url, breadcrumbs);
    }
    return breadcrumbs;
  }

}
