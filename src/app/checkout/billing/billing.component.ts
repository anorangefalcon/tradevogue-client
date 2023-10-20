import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent{

  checkoutHtml: string = '';
  checkoutCss: string = '';
  item: any = {};
  cartitems: any = {}
  total: any = {}
  quantity: any = {}


    // ngOnInit():void {
    // const script = this.renderer.createElement('script');
    // script.type = 'text/javascript';
    // script.src = 'http://localhost:5000/checkout.js';
    // script.defer = true;
    // this.renderer.appendChild(this.document.body, script);
    // }

  constructor(private cartService: CartService,
    private cookie: CookieService,private fetchDataService:FetchDataService,private backendURLs:UtilsModule) {
    this.cartService.fetchCart().subscribe((data) => {
  
      this.cartitems = data;
    });
    
    const checkSubTotal = () => {
      if (this.cartitems.amounts.subTotal !== 0) {
        this.total = this.cartitems.amounts.total;
        // this.quantity = this.cartitems.details.map((item: { Quantity: any; }) => item.Quantity);
        // console.log("Total:", this.total , "Quantity:", this.quantity);

            {
      this.item = [
        {
          "id": this.cartitems.details.map((item: { sku: any; }) => item.sku),
          "name": this.cartitems.details.map((item: { name: any; }) => item.name),
          "price": this.cartitems.amounts.total,
          "quantity": this.cartitems.details.map((item: { Quantity: any; }) => item.Quantity),
        }
      ]
    }
    localStorage.setItem('paymentIntent', JSON.stringify(this.item));
      } else {
        setTimeout(checkSubTotal, 1000);
      }
    }

    checkSubTotal();

    // this.checkoutService.sendPayload(this.item).subscribe((data) => {
    //   this.checkoutHtml = data;
    // });
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


  // ADDRESS TS FILE---------
  userAddresses:any;
  async getAddresses(){
    
  let data:any=await  this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
  console.log("data is ",data)
  this.userAddresses=data.info.address;
  console.log('USERADDRESS Is ',this.userAddresses);
  
  }

  AddressSended:any;
  addnewAddress:boolean=false;
  EditAddress(address:any,index:any){
    const data=this.userAddresses[index];
    this.AddressSended={data,index};
    this.addnewAddress=true;
  }

  async RemoveAddress(address:any,index:any){
    try{
      console.log('address is ',address);
      const body={id:address._id}
      let deleteAddress=await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteAddress,body);
      
      this.userAddresses.splice(index);

    }

    catch(error){

    }
   
    
  }

  async ngOnInit(){
    this.getAddresses();
  }

}
