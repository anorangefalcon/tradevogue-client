import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';
// import { ToastService } from '../shared/services/toast.service';
import { MobileNoValidator } from './validators';
import { PopupService } from '../shared/services/popup.service';
import { Subject } from 'rxjs';
import { UserServiceService } from '../shared/services/user-service.service';
import { CartService } from '../shared/services/cart.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // showData: string = "profile";
  showData: string = "orders"
  isReadOnly: boolean = true;
  changePasswordForm: FormGroup;
  ShowComponent: boolean = false;
  ProfileForm: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  password: string = "password";
  password2: string = "password";
  password3: string = "password";
  AddressSended: boolean = false;
  receiveData: any;
  list: any = []
  wishlistedProducts: any;
  openedAccordionIndex: number | null = null;
  

  // addnewAddress:boolean=false;
  userAddresses!: any;
  TranslateData: boolean = false;


  // private toastService: ToastService
  constructor(private backendURLs: UtilsModule, private userService: UserServiceService, private fetchDataService: FetchDataService, private fb: FormBuilder, private cartService: CartService) {

    this.ProfileForm = fb.group(
      {
        firstname: fb.control(''),
        lastname: fb.control(''),
        email: fb.control('', [Validators.email, Validators.required]),
        mobile: fb.control('', [MobileNoValidator]),
        gender: fb.control('',),
        dob: fb.control(''),


      });


    this.changePasswordForm = fb.group({
      currentPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
      againNewPassword: fb.control('', [Validators.required, (control: any) => matchPasswordValidator(control, this.changePasswordForm)])
    })
  };


  async changeComponent(el: string) {
    this.showData = el;
    this.TranslateData = true;

    console.log("here");

    this.fetchDataService.HTTPGET(this.backendURLs.URLs.showWishlist).subscribe((data: any) => {
      

    })



    // this.list = wishlistsArray.map((item: any) => { return item['wishlistName'] })
    // console.log('wishlistsArray is ,', wishlistsArray);
    console.log(this.list);

  }
  async showWishlistedProducts(wishlist: string, index: number) {

    console.log(wishlist, "konisi wishlist", index, "i");

    const body = {
      wishlistName: wishlist
    }
    console.log(body, "body");

    this.wishlistedProducts = await this.fetchDataService.httpPost(this.backendURLs.URLs.showProducts, body)
    console.log(this.wishlistedProducts, "products wish");

    if (this.openedAccordionIndex === index) {
      this.openedAccordionIndex = null; // Close the currently open accordion
    } else {
      this.openedAccordionIndex = index; // Open the selected accordion
    }

  }

  async removeFromWishlist(productId: any, wishlistName: string, index: number) {
    console.log(productId, "del");
    const delProduct = {
      wishlistName: wishlistName,
      productId: productId
    }
    console.log(delProduct);

    let delData = await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteFromWishlist, delProduct)
    console.log(delData, "del");
    this.showWishlistedProducts(wishlistName, index)

  }

  moveToCart(sku: any) {
    this.cartService.addToCart({ sku });
  }


  async ngOnInit() {
    try {
      const data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getDetails);
      data.firstname = data.name.firstname;
      data.lastname = data.name.lastname;
      data.gender = data.info.gender;
      if (data.info.dob) {
        data.dob = data.info.dob.split('T')[0];
      }
      this.ProfileForm.patchValue(data);

    } catch (error) {

    }
  }

  async getAddresses() {

    this.showData = 'addresses';

    this.TranslateData = true;
    let Addresses = await this.userService.SubscribingValue('userAddresses');
    if (!Addresses) {
      let data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
      data = data.addresses;
      if (data.length != 0) {
        await this.userService.emittingValue('userAddresses', data);
        this.userAddresses = data;
      }
    }

    else {
      this.userAddresses = Addresses;
    }
  }

  AddAddress() {
    this.ShowComponent = true;
  }


  // CloseAddress(){
  //   // this.addnewAddress=false;
  // }


  // AddresscloseHandler(event:any){
  //   this.ShowComponent=event;
  //   this.receiveData='';
  // }

  AddressHandler(event: any) {
    if (!event) {
      this.ShowComponent = event;
    }
    //  edit request updated
    else if (event.index) {
      this.userAddresses[event.index] = event.data;
    }
    // new address added
    else {
      this.userAddresses.push(event.data);
    }
  }

  // NewAddressHandler(event:any){
  //   console.log('new address called-->');

  //   if(event.hasOwnProperty("index")){
  //      this.userAddresses[event.index]=event;      
  //     return;
  //   }
  //     this.userAddresses.push(event);
  //   // this.userAddresses=(event.info.address);
  // }


  async RemoveAddress(address: any, index: any) {
    try {
      const body = { address_id: address._id }
      let deleteAddress = await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteAddress, body);
      this.userAddresses.splice(index, 1);
    }
    catch (error) {
    }

  }



  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    this.receiveData = { data, index };
    this.ShowComponent = true;
  }





  TranslateBack() {
    this.TranslateData = false;
  }
  async onPasswordChange() {
    try {
      const body = {
        oldPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }
      const data: any = await this.fetchDataService.httpPost(this.backendURLs.URLs.changePassword, body)

      // this.toastService.successToast({ title: data.message })
    }
    catch (error) {

    }

  }




  editClick() {
    this.isReadOnly = !this.isReadOnly;
  }


  async saveDetails() {
    let body = {
      name: { firstname: this.ProfileForm.get('firstname')?.value, lastname: this.ProfileForm.get('lastname')?.value },
      email: this.ProfileForm.get('email')?.value,
      mobile: this.ProfileForm.get('mobile')?.value,
      "info.gender": this.ProfileForm.get('gender')?.value,
      "info.dob": new Date(this.ProfileForm.get('dob')?.value)
    }

    let response = await this.fetchDataService.httpPost(this.backendURLs.URLs.updateDetails, body);
    this.isReadOnly = !this.isReadOnly;
  }

  async MakeDefault(address: any, i: any) {
    try {
      const body = { address_id: address._id };
      const update: any = await this.fetchDataService.httpPost(this.backendURLs.URLs.setDefaultAddress, body);
      this.userAddresses = update[0].info.address;

    } catch (error) {

    }
  }

  //  ORDERS TS
  AllOrders!: any
  async getOrders() {
    this.showData = 'orders';
    this.AllOrders = await this.fetchDataService.httpGet(this.backendURLs.URLs.getParticularUserOrders);
    console.log('Allorders come is ', this.AllOrders);

  }

  getDate(orderDate: any) {
    console.log('orderDate spliting is ', (orderDate));

    return orderDate.split('T')[0];
  }


}