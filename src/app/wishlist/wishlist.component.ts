import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent {

  wishlistsArray : any 
  list : any = []
  direction:any='bottom';
  show:boolean=false;
  name = "jahnavi"

  constructor (private wishlistService: WishlistService) {
    // console.log("constructor called ------------> " );
    this.show=true;

    this.wishlistService.send$.subscribe((data)=>{    
      console.log('clicked-> acjdnjcd');
      
      this.wishlistsArray = data
      console.log(this.wishlistsArray, "array");
      this.list = this.wishlistsArray.map((item:any) => item['wishlistName']);
      console.log(this.list, "list"); 

    })

   

  }


  

  // constructor(private wishlistService:WishlistService){
  //   this.wishlistService.display$.subscribe((data)=>{
  //     console.log('data is -----------',data);
  //     this.showWishlistsDialog=data;
  //   })
  // }
  ngOnInit() {
    console.log("hello ngoninit");
    this.wishlistService.display$.subscribe((data)=>{
      console.log('true clicked---->->---->', data);
      if(data==true){
        
      }
    })
  }
  
  Close(){
    this.wishlistService.showWishlistsDialog.next(false);
  }

}
