import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
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
  newWishlist: string = '';
  productId: any;
  product: any;
  showTextField: boolean = false;
  showAddLabel: boolean = true;
  productName: string = "";
  ParentClosed:boolean=false;

  constructor(private wishlistService: WishlistService,
    private toastService: ToastService) {
  }

  async ngOnInit() {
    this.wishlistService.wishlistPopupData.subscribe((data)=>{
      if(!data) return;
      
      this.list=data.wishlists;
      this.show=true;        
    })
  }

  async addToWishlist(wishlistName: string) {
    this.wishlistService.AddtoWishlist(wishlistName);
    this.ParentClosed=true;
    this.showTextField=false;
    this.newWishlist = "";
  }
  
  ParenClosedHandler(event:any){
  this.ParentClosed=event;
  }

  handler(event: any) {
    this.show = event
  }
}



