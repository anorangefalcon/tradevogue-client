import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';
// import { ToastService } from '../shared/services/toast.service';
import { MobileNoValidator } from './validators';
import { Location } from '@angular/common';
import { CartService } from '../shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { StripPaymentService } from '../shared/services/stripe-Integration/strip-payment.service';
import { CheckoutService } from '../checkout/checkout.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { DialogBoxService } from '../shared/services/dialog-box.service';
import { ToastService } from '../shared/services/toast.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // showData: string = "profile";
  showData: string ="addresses"
  AllOrders!: any
  AddressLength:number=0;
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
  constructor(private backendURLs: UtilsModule,
     private wishlistService: WishlistService, 
     private fetchDataService: FetchDataService, 
     private fb: FormBuilder,
     private cartService: CartService, 
     private route: ActivatedRoute, 
     private location: Location,
     private stripePay: CheckoutService,
     private toastService : ToastService,
     private dialogBox : DialogBoxService) {
    // this.route.queryParams.subscribe(params => {
    //   const redirectStatus = params['redirect_status'];
    //   if (redirectStatus === 'succeeded') {
    //     this.stripePay.checkOrderStatus()
    //   }
    // });

    this.stripePay.checkOrderStatus()

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
      this.changeComponent(params.get('page'));
    });

    this.dialogBox.responseEmitter.subscribe(async (res: boolean) => {
      if (res == true) {
        this.fetchDataService.HTTPPOST(this.backendURLs.URLs.cancelOrder, this.body).subscribe((data)=>{
          this.getOrders();
          
        })
      }
    });

    this.ProfileForm.disable();
  };

  ngOnInit() {
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

  TranslateBack() {
    this.TranslateData = false;
  }

  changeComponent(el: string) {
    this.showData = el;
    this.location.replaceState('usersetting/'+el);
    if(el=='addresses'){
      this.getAddresses();
    }
    if (el == 'wishlist') {
      this.showWishlists();
    }
    if(el=='orders'){
      this.getOrders();
    }
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
      this.ProfileForm.disable();
    })

  }

  // wishlist work 
  showWishlists() {
    this.toggleAccordian(0);
    this.showWishlistedProducts('My Wishlist')
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.showWishlist).subscribe((data: any) => {
      this.productsArray = data.wishlists;
    })
  }

  showWishlistedProducts(wishlist: string) {
    this.wishlistService.showWishlistedProducts(wishlist).subscribe((data) => {
      this.wishlistedProducts = data;
    })
  }

  toggleAccordian(index: any) {
    if (this.openedAccordionIndex === index) {
      this.openedAccordionIndex = null; 
    } else {
      this.openedAccordionIndex = index; 
    }
  }

  removeWishlist(index: number) {
    this.wishlistService.removeWishlist({ index }).subscribe((data: any) => {
      const toast = {
        title : data.message
      }
      this.toastService.warningToast(toast);
      this.showWishlists()
    })
  }

  removeFromWishlist(productId: any, wishlistName: string) {
    this.wishlistService.removeFromWishlist(productId, wishlistName).subscribe((res: any)=>{

      if (res.response.modifiedCount) {
        // this.deleteProduct.next(true);
      }
    })
    this.wishlistedProducts.forEach((product: any) => {
      if (product.productDetails._id == productId) {
        this.wishlistedProducts.splice(this.wishlistedProducts.indexOf(product), 1)
        this.wishlistService.WishlistCount.next(this.wishlistService.WishlistCount.value - 1);
      }
    })
  }

  moveToCart(sku: any) {
    this.cartService.addToCart({ sku });
  }

//  WISHLIST DONE



//  ADDRESS
  getAddresses() {
    this.showData = 'addresses';
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getAddress)
      .subscribe((data: any) => {
        if (data) {
          data = data.addresses;
          this.AddressLength=data.length;
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
      this.AddressLength=this.userAddresses.length;
    }
    // // new address added
    else {
      this.userAddresses = event;
      this.AddressLength=this.userAddresses.length;
    }

  }

  RemoveAddress(address: any, index: any) {
    const body = { address_id: address._id }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.deleteAddress, body).subscribe((data) => {
      this.userAddresses.splice(index, 1);
      this.AddressLength=this.userAddresses.length;
    })
  }

  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    this.receiveData = { data, index };
    this.ShowComponent = true;
  }

  
  // change password work
  onPasswordChange() {
    const body = {
      oldPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.changePassword, body).subscribe((data: any) => {
      console.log(data);
      
      this.toastService.successToast({ title: data.message })
      this.changePasswordForm.reset()
    });
  }


  async MakeDefault(address: any,index:any) {
    try {
      const body = { address: address ,index};
      this.fetchDataService.HTTPPOST(this.backendURLs.URLs.setDefaultAddress, body).subscribe((data)=>{
        this.userAddresses = data;
      });
      
    } catch (error) {

    }
  }

  // orders code 
   getOrders(){
    this.toggleAccordian(0);
    setTimeout(()=>{
      this.TranslateData=true;
    },300)
     this.fetchDataService.HTTPGET(this.backendURLs.URLs.getParticularUserOrders).subscribe((data:any)=>{
        this.AllOrders=data;   
    });      
  }

  getDate(orderDate: any) {
    return orderDate.split('T')[0];
  }

  BuyAgain(product: any) {
    this.cartService.addToCart(product);
  }


  CancelProduct(id:any,sku:any){
    this.body = { id , sku}
    let   template: any = {
      title: 'Cancel Order',
      subtitle: 'Are you sure you want to remove product from the order?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBox.confirmationDialogBox(this.template);

  }

}