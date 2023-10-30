import { Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
import { CartService } from 'src/app/shared/services/cart.service';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

  checkoutHtml: string = '';
  checkoutCss: string = '';
  item: any = {};
  receiveData:any;
  ShowComponent:boolean=false;
  
  total: any = {}
  quantity: any = {}


  constructor(private cookie: CookieService, private fetchDataService: FetchDataService, private cartService:CartService, private userService: UserServiceService, private backendURLs: UtilsModule) {
    this.userService.PaymentUrlVisited.next(true);
    this.getAddresses();
  }



  @ViewChild('mydiv') my_div: ElementRef | undefined;
  search_text: any = '';
  visible_data: any[] = [];


  not_visible_data: any[] = ['Plain', 'Relaxed', 'Solid', 'Washed'];

  remove_data(el: any) {
    this.not_visible_data.push(el);
    this.visible_data = this.visible_data.filter((e) => { return el != e })
  }

  add_data(el: any) {
    console.log("el is ", el);
    this.visible_data.push(el);
    this.not_visible_data = this.not_visible_data.filter((e) => { return el != e })

  }

  clicked() {
    console.log("my div is ", this.my_div);
    this.my_div?.nativeElement.classList.toggle('display_none');
  }


  // ADDRESS TS FILE---------------------
  userAddresses: any;
  navbar_scroll_style: boolean = false;
  cart: any = '';
  CouponApplied: any = '';
  DeliveredAddress: any= '';


  async getAddresses() {
      let data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
      data = data.addresses;
      this.userAddresses = data;
    }


    AddAddress(){
      this.ShowComponent=true;
    }
  
    EditAddress(address:any,index:any){
      const data=this.userAddresses[index];
      this.receiveData={data,index};
      this.ShowComponent=true;
    }
  
  
  
    AddressHandler(event:any){
      if(!event){
        this.ShowComponent=event;
      }
      //  edit request updated
      else if(event.index){
        this.userAddresses[event.index]=event.data;
      }
      // new address added
      else{
        this.userAddresses.push(event.data);
      }
   }
  
  

  async RemoveAddress(address:any,index:any){
    try{
      const body={address_id:address._id}
      let deleteAddress=await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteAddress,body);
      this.userAddresses.splice(index,1);
    }
    catch(error){
    }
     
  }


  SelectAddress(address: any) {
    this.DeliveredAddress = address;
    this.userService.emittingValue('DeliveryAddress', this.DeliveredAddress);

  }

  ChangeAddress() {
    this.DeliveredAddress = false;
  }

  async MakeDefault(address: any, i: any) {
    try {
      const body = { address_id: address._id };
      const update: any = await this.fetchDataService.httpPost(this.backendURLs.URLs.setDefaultAddress, body);
      this.userAddresses = update[0].info.address;

    } catch (error) {

    }
  }

  // ProceedToPayment(){
  //   try {
  //     this.cartService.fetchCart().subscribe((data)=>{
  //       console.log('data is ',data);
        
  //     })
        
  //   } catch (error) {
      
  //   }
    
  // }

}
