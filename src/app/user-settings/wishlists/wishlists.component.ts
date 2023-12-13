import { Component } from '@angular/core';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { Subscription } from 'rxjs';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { UtilsModule } from 'src/app/utils/backend-urls';


@Component({
  selector: 'app-wishlists',
  templateUrl: './wishlists.component.html',
  styleUrls: ['./wishlists.component.css']
})
export class WishlistsComponent {

  loading: boolean = false;
  wishlistedProducts: any;
  AccordianIndex: number = 0;
  openedAccordionIndex: number | null = null;
  allSubscriptions: Subscription[] = [];
  productsArray: any = [];
  wishlistCount: number = 0;
  deleteIndex: any;
  theme: Boolean = false;


  constructor(private wishlistService: WishlistService,
    private fetchDataService: FetchDataService,
    private backendURLs: UtilsModule,
    private dialogBox: DialogBoxService,
    private toastService: ToastService,
    private cartService: CartService) {

    this.allSubscriptions.push(
      dialogBox.responseEmitter.subscribe({
        next: (res: any) => {
          if (res) {
            this.wishlistService.removeWishlist({ index: this.deleteIndex }).subscribe((data: any) => {
              const toast = {
                title: data.message
              }
              this.toastService.warningToast(toast);
              this.wishlistService.showWishlistedProducts().subscribe((data) => {
                this.wishlistedProducts = data
              })
              this.wishlistService.getWishlistCount()
            })
          }
        }
      }));

  }

  ngOnInit() {
    this.loading = true;
    this.fetchDataService.themeColor$.subscribe((color)=>{
      this.theme = color;
    })
    this.toggleAccordian(0);
    this.allSubscriptions.push(
      this.wishlistService.showWishlistedProducts().subscribe((data) => {
        this.wishlistedProducts = data
        console.log(this.wishlistedProducts);
        this.loading = false;
      }))
    this.wishlistService.getWishlistCount();

  }

  toggleAccordian(index: any, check: boolean = false) {

    this.AccordianIndex = index;

    if (check) {
      this.openedAccordionIndex = index;
      return;
    }
    if (this.openedAccordionIndex === index) {
      this.openedAccordionIndex = null;
    } else {
      this.openedAccordionIndex = index;
    }
  }

  showWishlists() {
    this.toggleAccordian(0);
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.showWishlist).subscribe((data: any) => {
      this.productsArray = data.wishlists;
      this.loading = false;
      this.wishlistCount = data.count
    })
  }

  removeWishlist(index: number) {
    this.deleteIndex = index;
    let template: any = {
      title: 'Proceed with Deletion?',
      subtitle: 'The wishlist will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Delete it',
      cancelText: 'No, Keep it',
    };
    this.dialogBox.confirmationDialogBox(template);
  }


  removeFromWishlist(productId: any, wishlistName: string) {

    this.wishlistService.removeFromWishlist(productId, wishlistName).subscribe((res: any) => {

      console.log(res, "remove response");

      if (res.response.modifiedCount) {
        this.wishlistedProducts = res.data;
        this.wishlistService.getWishlistCount()
        this.toastService.warningToast({ title: 'Product removed!' })
      }
    });

  }

  moveToCart(product: any) {
    this.cartService.addToCart(product);
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }


}
