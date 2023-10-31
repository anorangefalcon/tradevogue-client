import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UserServiceService } from '../shared/services/user-service.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent {

  // wishlistsArray: any
  list: any = []
  direction: any = 'popup';
  show: boolean = false;
  new: string = "";
  selectedWishlist: string = '';
  productId: any;
  product: any;
  showTextField: boolean = false;
  showAddLabel: boolean = true;
  productName: string = "";

  constructor(private wishlistService: WishlistService,
    private utils: UtilsModule,
    private UserService: UserServiceService,
    private fetchDataService: FetchDataService,
    private toastService: ToastService) {
  
  }

  async ngOnInit() {

    // this.wishlistService.display$.subscribe(async (data: any) => {

    //   // this.show = data.show ? true : false;
    //   console.log(data, "count");
      
    //   if (data){
    //     this.show = true
    //   }
    //   this.productId = data.productData?._id
  
    //   this.product = data.productData;
      
    //   this.productName = data.productData?.name
  
    //   let wishlistsArray: any = data.data.wishlists
    //   // console.log('wishlist Array is -------> ', wishlistsArray);

    //   if (wishlistsArray) {
    //     this.list = wishlistsArray.map((item: any) => { return item['wishlistName'] })
    //     console.log('wishlistsArray is ,', wishlistsArray);
    //   }
    // })

    this.wishlistService.wishlistPopupData.subscribe((data: any) => {
      console.log(data);
      
        this.show = data ? true : false;
        
        // this.productId = data.productData?._id
    
        // this.product = data.productData;
        
        // this.productName = data.productData?.name
    
        // let wishlistsArray: any = data.data.wishlists
        // // console.log('wishlist Array is -------> ', wishlistsArray);
  
        // if (wishlistsArray) {
        //   this.list = wishlistsArray.map((item: any) => { return item['wishlistName'] })
        //   console.log('wishlistsArray is ,', wishlistsArray);
        // }
      })

    let myData = await this.UserService.SubscribingValue('wishlists')
    console.log("mudata", myData);

  }


  async showWishlists() {
    
    // this.wishlistService.showWishlist().subscribe()
    // let data: any = await this.UserService.SubscribingValue('wishlists');
  }

  async addToWishlist(item: string = '') {

    console.log("meeee------>");

    if (item) {
      this.selectedWishlist = item;
    }
    console.log(this.selectedWishlist, "hoo")

    const body = {
      wishlistName: this.selectedWishlist,
      productId: this.productId
    }
    console.log(body, "product body");
    
    let data: any = await this.fetchDataService.httpPost(this.utils.URLs.addToWishlist, body)
    const toastMessage = { title: data.message };
    this.toastService.notificationToast(toastMessage);
    console.log(data, "hua add wishlist mein?");

    // let newCount = await this.fetchDataService.httpGet(this.utils.URLs.showWishlistCount)
    // await this.UserService.emittingValue('wishlistCount', newCount);

    // console.log(newCount, "neww counttt");
    this.showTextField = false;

    // this.show = false
    console.log("end");

    // this.wishlistService.addToWishlist(item,this.productId)
    // setTimeout(() => {
    //   this.show = false;
    // }, 300);

  }

  async addNewWishlist() {
    console.log("hiiii");

    const body = {
      wishlistName: this.selectedWishlist
    }

    let data = await this.fetchDataService.httpPost(this.utils.URLs.addNewWishlist, body);
    console.log(data, "add huaa?");

    this.addToWishlist()
  }
  
  handler(event: any) {
    this.show = event
  }
}



