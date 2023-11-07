import { Component, ViewEncapsulation } from '@angular/core';


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
  title: string = 'Dashboard';

  navitems = [
    { name: 'Dashboard', icons: 'grid_view', route: '/dashboard' },
    {
      name: 'Products', route:'', icons: 'inventory', sublist: [
        { name: 'Product Overview', route: '/dashboard/products' },
        { name: 'Add Features', route: '/dashboard/features' },
        { name: 'Add Product', route: '/dashboard/addproduct' },
      ]
    },
    { name: 'Orders', icons: 'shopping_cart', route: '/dashboard/orders' },
    { name: 'Promo Code', icons: 'redeem' ,route: '/dashboard/coupons'},
    {
      name: 'Customise', route:'',icons: 'build', sublist: [
        { name: 'HomePage', route: '/dashboard/customise-home'},
        { name : 'Banner', route : '/dashboard/banner'},
        { name: 'Socials', route: '/dashboard/socials' },
        { name: 'FAQs', route: '/dashboard/faq' },
        { name: 'Payment Keys' , route: '/dashboard/monetization'},
        { name: 'Sales' , route: '/dashboard/sales'}
      ]
    },
    {
      name: 'Support Tickets', route:'', icons: 'chat_bubble', sublist: [
        { name: 'Ticket Types', route: '/dashboard/support' },
        { name: 'Tickets' , route: '/dashboard/tickets'},
        // {name: 'Monetization', route: '/dashboard/monetization'}
      ]
    },
    { name: 'Logout', icons: 'logout', route: '' }
  ]

  ngOnInit() {
    window.addEventListener("resize", () => {
      let check = window.matchMedia("(max-width: 992px)");
      // console.log(check.matches);
      if (check.matches) {
        this.isCollapse = true;
        console.log(this.isCollapse);
        return;
      }
      this.isCollapse = false;
    });
  }

  sales_dropdown() {
    this.isSalesBtnActive = !this.isSalesBtnActive;
  }

  product_dropdown() {
    this.isProductBtnActive = !this.isProductBtnActive;
  }
}
