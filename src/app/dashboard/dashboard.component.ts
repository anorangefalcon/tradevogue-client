import { Component, ViewEncapsulation } from '@angular/core';
import { LoginCheckService } from '../shared/services/login-check.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  isCollapse: boolean = false;
isSalesBtnActive: boolean = false;
  isProductBtnActive: boolean = false;
  adminName: String = '';

  constructor(private userService: LoginCheckService){}

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
        { name: 'Terms & Conditions', route : '/dashboard/customise-tc'},
        { name: 'About Us', route: '/dashboard/customise-about'},
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
    { name: 'Logout', icons: 'logout', route: '' , function:'logout()'}
  ]

  ngOnInit() {

    this.userService.getUser('name').subscribe((data: any) => {
      this.adminName = data;
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
  }

  sales_dropdown() {
    this.isSalesBtnActive = !this.isSalesBtnActive;
  }

  product_dropdown() {
    this.isProductBtnActive = !this.isProductBtnActive;
  }

  logout(){    
    this.userService.logoutUser();
  }
}
