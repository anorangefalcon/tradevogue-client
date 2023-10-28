import { Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

  checkoutHtml: string = '';
  checkoutCss: string = '';
  item: any = {};
  total: any = {}
  quantity: any = {}


  constructor(private cookie: CookieService, private fetchDataService: FetchDataService, private userService: UserServiceService, private backendURLs: UtilsModule) {
    this.getAddresses();
  }


  //  ngOnInit(){
  //     this.getAddresses();
  //   }


  ngOnInit() {


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
  // async getAddresses(){
  // let data:any=await  this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
  // this.userAddresses=data.info.address;  
  // }


  async getAddresses() {;
    let Addresses = await this.userService.SubscribingValue('userAddresses');
    if (!Addresses) {
      let data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
      data = data.addresses;
      this.userAddresses = data;
      if (data.length != 0) {
        await this.userService.emittingValue('userAddresses', data);
        this.userAddresses = data;
      }
    }

    else {
      this.userAddresses = Addresses;
    }


  }

  AddressSended: any;
  addnewAddress: boolean = false;
  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    this.AddressSended = { data, index };
    this.addnewAddress = true;
  }

  async RemoveAddress(address: any, index: any) {
    try {
      const body = { id: address._id }
      let deleteAddress = await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteAddress, body);
      this.userAddresses.splice(index);
    }

    catch (error) {

    }


  }


  NewAddressHandler(event: any) {
    if (event.hasOwnProperty("index")) {
      this.userAddresses[event.index] = event;
      return;
    }
    this.userAddresses.push(event);
  }

  CloseAddress() {
    this.addnewAddress = false;
  }

  AddAddress() {
    this.addnewAddress = true;
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


  //  async CreateOrder(){
  //     this.cartService.fetchCart().subscribe(async (data:any)=>{
  //       const body={products:data.details, deliveryAddress:this.DeliveredAddress};
  //       const response=await this.fetchDataService.httpPost(this.backendURLs.URLs.createOrder,body);

  //     });

  //   }


}
