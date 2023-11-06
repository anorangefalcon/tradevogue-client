import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../faq-page/fetch-data.service';
import { RouterLinksService } from '../shared/services/router-links.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';
// import { ToastService } from '../shared/services/toast.service';
import { MobileNoValidator } from './validators';
import { CartService } from '../shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StripPaymentService } from '../shared/services/stripe-Integration/strip-payment.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { DialogBoxService } from '../shared/services/dialog-box.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showData: string = "profile";
  AllOrders!: any
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
  productsArray: any = [];
  receiveData: any;
  list: any = []
  wishlistedProducts: any;
  openedAccordionIndex: number | null = null;
  stripe: any;

  productStatus: any = 'cancelled';

  body:any;

  template: any = {
    title: 'Are You Sure! Want to Cancel?',
    subtitle: `You can't view this in your list anymore if you delete!`,
    type: 'confirmation',
    confirmationText: 'Yes, Cancel it',
    cancelText: 'No, Revert'
  };

  // addnewAddress:boolean=false;
  userAddresses!: any;
  TranslateData: boolean = false;

  // private toastService: ToastService
  constructor(private backendURLs: UtilsModule, private wishlistService:WishlistService, private fetchDataService: FetchDataService, private fb: FormBuilder, private cartService: CartService, private route: ActivatedRoute, private stripePay: StripPaymentService, private dialogBox: DialogBoxService) {

    this.route.queryParams.subscribe(params => {
      const redirectStatus = params['redirect_status'];
      if (redirectStatus === 'succeeded') {
        console.log("yes succeed")

        
        this.stripePay.checkOrderStatus()
      }
    });

    // if(this.route.url()=='/cart/billing'){
    //   this.getOrders();
    // }
    

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

    this.route.paramMap.subscribe((params: any) => {
      console.log('params.page is ', params, " page is ", params.get('page'));

      this.changeComponent(params.get('page'));

    });

    this.dialogBox.responseEmitter.subscribe(async (res: boolean) => {
      if (res == true) {
        await this.fetchDataService.httpPost(this.backendURLs.URLs.cancelOrder, this.body);
        // this.fetchData();
        this.dialogBox.responseEmitter.next(false);
      }
    });

    
  };

  async changeComponent(el: string) {
    this.showData = el;
    this.TranslateData = true;
    if (el == 'wishlist') {
      this.showLists();
    }
  }

  showLists() {
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.showWishlist).subscribe((data: any) => {
      this.productsArray = data.wishlists;
      console.log(this.productsArray, "djckdsb");
    })
  }

  async showWishlistedProducts(wishlist: string, index: number) {


    const body = {
      wishlistName: wishlist
    }

    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.showProducts, body).subscribe((data) => {
      this.wishlistedProducts = data;
      console.log(data, "products?/?");
      
      console.log(this.wishlistedProducts, "wishlisted products");

    })



    if (this.openedAccordionIndex === index) {
      this.openedAccordionIndex = null; // Close the currently open accordion
    } else {
      this.openedAccordionIndex = index; // Open the selected accordion
    }

  }

  removeWishlist(index: number) {
    console.log("del dunc");

    this.wishlistService.removeWishlist({ index }).subscribe((data) => {
      console.log("am i called?");
      this.showLists()
    })
  }

  async removeFromWishlist(productId: any, wishlistName: string, index: number) {
    // console.log(productId, "del");
    const delProduct = {
      wishlistName: wishlistName,
      productId: productId
    }
    // console.log(delProduct);

    let delData = await this.fetchDataService.httpPost(this.backendURLs.URLs.deleteFromWishlist, delProduct)

    // console.log(delData, "del");
    // this.showWishlistedProducts(wishlistName, index)

    // console.log("del function");
    // console.log(this.productsArray, "products array");

    // this.productsArray.forEach((wishlists: any)=>{
    //   if (wishlists.wishlistName == wishlistName){
    //     console.log(wishlists, "before splice");

    //     // wishlists.splice(productId, 1);
    //     wishlists.products.splice(wishlists.products.indexOf(productId),1);
    //     console.log(wishlists, "after splice");



    //   }

    // })


    this.wishlistedProducts.forEach((product: any) => {
      // console.log(product, "single product");
      if (product.productDetails._id == productId) {
        this.wishlistedProducts.splice(this.wishlistedProducts.indexOf(product), 1)
        this.wishlistService.WishlistCount.next(this.wishlistService.WishlistCount.value - 1);
      }


    })



    // this.wishlistService.removeFromWishlist(productId,wishlistName,index);
    // this.wishlistService.delete$.subscribe((data)=)




  }

  moveToCart(sku: any) {
    this.cartService.addToCart({ sku });
  }

  async ngOnInit() {
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getDetails).subscribe((data: any) => {
      data.firstname = data.name.firstname;
      data.lastname = data.name.lastname;
      data.gender = data.info.gender;
      if (data.info.dob) {
        data.dob = data.info.dob.split('T')[0];
      }
      this.ProfileForm.patchValue(data);
    })
  }

  getAddresses() {
    this.showData = 'addresses';
    this.TranslateData = true;
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getAddress)
      .subscribe((data: any) => {
        if (data) {
          data = data.addresses;
          if (data.length != 0) {
            this.userAddresses = data;
          }
        }
      })
  }

  AddAddress() {
    this.receiveData = '';
    this.ShowComponent = true;
  }

  AddressHandler(event: any) {
    if (!event) {
      this.ShowComponent = event;
    }


    //edit request updated
    else if (event.index === 0 || event.index) {
      this.userAddresses[event.index] = event.data;
    }
    // // new address added
    else {
      this.userAddresses = event;
    }

  }

  RemoveAddress(address: any, index: any) {
    console.log('address coming is ', address);
    const body = { address_id: address._id }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.deleteAddress, body).subscribe((data) => {
      console.log('data comes is after deletion', data);

      this.userAddresses.splice(index, 1);
    })
  }

  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    this.receiveData = { data, index };
    this.ShowComponent = true;
  }

  TranslateBack() {
    this.TranslateData = false;
  }

  onPasswordChange() {
    const body = {
      oldPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.changePassword, body).subscribe((data) => {
      // this.toastService.successToast({ title: data.message })
    });
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
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.updateDetails, body).subscribe((data) => {
      this.isReadOnly = !this.isReadOnly;
    })

  }

  async MakeDefault(address: any) {
    try {
      const body = { address: address };
      const data: any = await this.fetchDataService.httpPost(this.backendURLs.URLs.setDefaultAddress, body);
      this.userAddresses = data;

    } catch (error) {

    }
  }

  //  ORDERS TS
  getOrders() {
    this.showData = 'orders';
    this.TranslateData = true;
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getParticularUserOrders).subscribe((data: any) => {
      this.AllOrders = data;
    });
  }

  getDate(orderDate: any) {
    return orderDate.split('T')[0];
  }

  BuyAgain(product: any) {
    this.cartService.addToCart(product);
  }


  CancelProduct(orderId:any,productId:any){
    this.body = { orderId , productId}
    this.dialogBox.confirmationDialogBox(this.template);
  }

}