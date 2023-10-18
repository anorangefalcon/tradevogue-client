import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class DashboardComponent {

  isCollapse: boolean = false;
  isSalesBtnActive: boolean = false;
  isProductBtnActive: boolean = false;
  title: string = 'Dashboard';

  navitems = [
    { name: 'Dashbaord', icons: 'grid_view', route: '/dashboard' },
    {
      name: 'Products', icons: 'inventory', sublist: [
        { name: 'Product Overview', route: '/dashboard/products' },
        { name: 'Add Features', route: '/dashboard/features' },
        { name: 'Add Product', route: '/dashboard/addproduct' },
      ]
    },
    { name: 'Orders', icons: 'shopping_cart', route: '/dashboard/orders' },
    { name: 'Reviews', icons: 'reviews', route: '' },
    { name: 'Promo Code', icons: 'redeem' ,route: '/dashboard/coupons'},
    {
      name: 'Elements', icons: 'build', sublist: [
        { name: 'FAQs', route: '/dashboard/faq' },
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
