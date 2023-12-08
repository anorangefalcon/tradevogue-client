import { Component, ElementRef } from '@angular/core';
import { TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-select-layout',
  templateUrl: './select-layout.component.html',
  styleUrls: ['./select-layout.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SelectLayoutComponent {
  @ViewChild('hero') hero!: TemplateRef<any>;
  @ViewChild('collection') collection!: TemplateRef<any>;
  @ViewChild('deal') deal!: TemplateRef<any>;
  @ViewChild('latestProducts') latestProducts!: TemplateRef<any>;
  @ViewChild('offers') offers!: TemplateRef<any>;
  @ViewChild('productCarousel') productCarousel!: TemplateRef<any>;
  @ViewChild('newsletter') newsletter!: TemplateRef<any>;

  elements: String[] = ['hero', 'collection', 'productCarousel', 'deal', 'offers', 'latestProducts', 'newsletter']; // default direction
  States: any = {};
  edited: Boolean = false;
  Direction: any[] = [];
  popUpDirection: any = 'popup';
  showingPopUp: boolean = false;
  newName: String = '';
  loadingData: Boolean = false;
  layouts: any = [];
  currentLayout: any = {};
  theme: Boolean = false;
  allSubscriptions: Subscription[] = [];

  constructor(private fetchDataService: FetchDataService, private backendUrls: UtilsModule,
    private toastService: ToastService, private router: Router) { }

  ngOnInit() {
    this.allSubscriptions.push(
      this.fetchDataService.themeColor$.subscribe((color) => {
        this.theme = color;
      }));
    this.fetchLayouts();
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
  }

  fetchLayouts(created: boolean = false) {
    this.loadingData = true;
    this.allSubscriptions.push(
      this.fetchDataService.HTTPGET(this.backendUrls.URLs.getAllHomeLayouts)
        .subscribe((data: any) => {
          this.layouts = data;

          const findQuery = () => {
            if (created) {
              return ((item: any) => item.name === this.currentLayout.name);
            }

            return ((item: any) => item.active === true);
          }

          this.currentLayout = JSON.parse(JSON.stringify(this.layouts.find(findQuery())));
          this.newName = this.currentLayout?.name;
          this.loadingData = false;
        }));
  }

  switchStatus(event: any, name: String) {
    const index = this.getIndexFromName(name);
    const newStatus = (<HTMLInputElement>event.target).checked;

    this.currentLayout.layout[index].active = newStatus;
    this.edited = true;
  }

  moveUp(name: String) {
    const index = this.getIndexFromName(name);

    if (index > 1) {
      const tempCurrentVal = this.currentLayout.layout[index];
      this.currentLayout.layout[index] = this.currentLayout.layout[index - 1];
      this.currentLayout.layout[index - 1] = tempCurrentVal;
    }

    this.scroll('up');
    this.edited = true;
  }

  moveDown(name: String) {
    const index = this.getIndexFromName(name);

    if (index >= 1) {
      const tempCurrentVal = this.currentLayout.layout[index];
      this.currentLayout.layout[index] = this.currentLayout.layout[index + 1];
      this.currentLayout.layout[index + 1] = tempCurrentVal;
    }

    this.scroll('down');
    this.edited = true;
  }

  createNewLayout() {

    const getLayoutName = (layoutInt: number): any => {
      const layoutName = 'layout ' + (this.layouts.length + layoutInt);

      const matched = this.layouts.some((item: any) => {
        if (item.name == layoutName) {
          return true;
        }
        return false;
      });

      if (matched) return getLayoutName(layoutInt + 1);

      return layoutName;
    }

    let newLayout = {
      name: getLayoutName(1),
      layout: <any>[]
    }

    this.elements.forEach((item) => {
      newLayout.layout.push(
        { 'name': item }
      );
    })

    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.createOrUpdateHomeLayout, newLayout)
        .subscribe(() => {
          this.currentLayout.name = newLayout.name;
          this.fetchLayouts(true);
          this.edited = false;
        }));
  }

  updateLayout(nameUpdated: Boolean = false) {

    if (nameUpdated && this.newName != '') this.currentLayout.name = this.newName;

    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.createOrUpdateHomeLayout, this.currentLayout)
        .subscribe({
          next: () => {
            this.edited = false;
            this.fetchLayouts(true);
            this.toastService.successToast({
              title: 'Successfully updated ' + this.currentLayout.name
            });
          },
          error: () => {
            this.fetchLayouts();
          }

        }));
    this.newName = '';
  }

  deleteLayout() {
    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.deleteHomeLayout, { id: this.currentLayout._id })
        .subscribe(() => {
          this.edited = false;
          this.showingPopUp = false;
          this.toastService.successToast({
            title: 'Successfully deleted ' + this.currentLayout.name
          });
          this.fetchLayouts();
        }));
  }

  activateLayout() {
    this.currentLayout.active = true;
    this.updateLayout();
    this.toastService.successToast({
      title: this.currentLayout.name + ' is Now Active'
    });
  }

  // helpers:
  getIndexFromName(name: String) {
    return this.currentLayout.layout.findIndex((item: any) => item.name === name);
  }

  selectLayout(event: any) {
    this.edited = false;
    this.currentLayout = this.layouts.find((item: any) => item.name === event);
    this.newName = this.currentLayout.name;
  }

  getLayoutsNames() {
    return this.layouts.map((item: any) => item = item.name);
  }

  getTemplate(item: string): TemplateRef<any> {
    switch (item) {
      case 'hero':
        return this.hero;
      case 'collection':
        return this.collection;
      case 'deal':
        return this.deal;
      case 'latestProducts':
        return this.latestProducts;
      case 'offers':
        return this.offers;
      case 'productCarousel':
        return this.productCarousel;
      case 'newsletter':
        return this.newsletter;
      default:
        return null!;
    }
  }

  PopUpChangeHanlder(event: boolean) {
    this.showingPopUp = event;
  }

  navigate(name: any) {
    this.router.navigate(['/dashboard/customise-home/' + name]);
  }

  navigateToHighlightProducts() {
    this.toastService.notificationToast({
      title: 'Star Products to Show in Carousel'
    })
    this.router.navigateByUrl('dashboard/products');
  }

  scroll(where: String) {
    var currentPosition = window.pageYOffset;
    var targetPosition = currentPosition;
    targetPosition += (where == 'down') ? 300 : -300;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }
}
