import { Component, ViewEncapsulation } from '@angular/core';
import { LoginCheckService } from '../shared/services/login-check.service';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsModule } from '../utils/utils.module';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  isCollapse: boolean = false;
  adminName: String = '';
  darkTheme: Boolean = false;
  allSubscriptions: Subscription[] = [];
  chatLength: number = 0;

  constructor(private userService: LoginCheckService,
    private router: Router,
    private backendURL: UtilsModule,
    private fetchDataService: FetchDataService) {
      this.allSubscriptions.push(
    this.fetchDataService.themeColor$.subscribe((color) => {
      this.darkTheme = color;
    }));
  }

  toggleTheme(){
    this.darkTheme = !this.darkTheme;
    this.fetchDataService.toggleTheme(this.darkTheme);
  }

  navitems = [
    { name: 'Dashboard', icons: 'grid_view', route: '/dashboard' },
    {
      name: 'Products', route: '', icons: 'inventory', sublist: [
        { name: 'Product Overview', route: '/dashboard/products' },
        { name: 'Add Features', route: '/dashboard/features' },
        { name: 'Add Product', route: '/dashboard/addproduct' },
      ]
    },
    { name: 'Orders', icons: 'shopping_cart', route: '/dashboard/orders' },
    { name: 'Promo Code', icons: 'redeem', route: '/dashboard/coupons' },
    {
      name: 'Customise', route: '', icons: 'build', sublist: [
        { name: 'Home Page', route: '/dashboard/customise-home' },
        { name: 'FAQs', route: '/dashboard/customise-faq' },
        { name: 'Terms & Conditions', route: '/dashboard/customise-tc' },
        { name: 'About Us', route: '/dashboard/customise-about' },
        { name: 'Socials', route: '/dashboard/socials' },
        { name: 'Payment Keys', route: '/dashboard/monetization' },
      ]
    },
    {
      name: 'Support Tickets', route: '', icons: 'chat_bubble', sublist: [
        { name: 'Ticket Types', route: '/dashboard/support' },
        { name: 'Tickets', route: '/dashboard/tickets' },
        // {name: 'Monetization', route: '/dashboard/monetization'}
      ]
    },
    {
      name: 'Notifications', route: '/dashboard/notification', icons: 'notifications'
    },
    { name: 'Logout', icons: 'logout', route: '', function: 'logout()' }
  ]

  ngOnInit() {

    this.allSubscriptions.push(
    this.userService.getUser('name').subscribe((data: any) => {
      this.adminName = data;
    }));

    this.fetchDataService.HTTPGET(this.backendURL.URLs.getChatDetails).subscribe((res: any)=> {
      this.chatLength = res.length;
    });

    // window.addEventListener("resize", () => {
    //   let check = window.matchMedia("(min-width: 768px)");

    //   if (check.matches) {
    //     this.isCollapse = true;
    //     console.log("this.co", this.isCollapse);
    //     return;
    //   }
    //   this.isCollapse = false;
    // });
    // this.checkRoute();
    this.fetchNotfications();
  }

  notficationList: any = [];
  notficationStatus: boolean = true;


  fetchNotfications(){
    this.fetchDataService.HTTPGET(this.backendURL.URLs.fetchSellerNotfications).subscribe({
      next: (res: any)=>{

        this.notficationList = [];

        if(!res.length){
          this.notficationStatus = false;
          return;
        }

        res.forEach((product: any)=>{
          let cardTemplate = {
            image: product.assets[0].photo[0],
            name: product.name,
            category: product.info.category,
            price: product.price,
            sku: product.sku
          };

          this.notficationList.push(cardTemplate);
        });
        console.log(this.notficationList);
      }
    })
  }

  checkRoute(){
    console.log(this.router.routerState.snapshot.url.split('/dashboard'));
  }

  logout() {
    this.userService.logoutUser();
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
   } 
}
