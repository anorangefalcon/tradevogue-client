import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { passwordStrengthValidator, matchPasswordValidator } from '../auth/validators';
import { Location } from '@angular/common';
import { CartService } from '../shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from '../shared/services/wishlist.service';
import { DialogBoxService } from '../shared/services/dialog-box.service';
import { ToastService } from '../shared/services/toast.service';
import { LoginCheckService } from '../shared/services/login-check.service';
import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { InvoiceTemplateService } from '../shared/services/invoice-template.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showData: string = "profile";
  // showData: string = "addresses";
  checkAccordingClick: Boolean = true;
  loading: Boolean = false;
  theme: Boolean = false;
  AccordianIndex: number = 0;
  totalCount: number = 0;
  cancelledOrdersCount: number = 0;
  currentPage: number = 1;
  cancelledCurrentPage: number = 1;
  AllOrders!: any;
  CancelledOrders!: any[];
  DefaultShowOrders = 'active';
  ProfileDisabled: boolean = true;
  // AddressLength: number = 0;
  changePasswordForm: FormGroup;
  ShowComponent: boolean = false;
  ProfileForm: FormGroup;
  ProfileFormCopy:any
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
  wishlistCount: number = 0;

  productStatus: any = 'cancelled';
  allSubscriptions: Subscription[] = [];
  body: any;
  DialogSubcribe: any;


  TemplatePagination: any = {
    currentPage: this.currentPage,
    limit: 80,
    active: true, paymentStatus:'success'
   
  }

  cancelledTempatePagination: any = {
    currentPage: this.cancelledCurrentPage,
    limit: 80,
    paymentStatus:'refund',
    active: false
  }

  template: any = {
    title: 'Are You Sure! Want to Cancel?',
    subtitle: `You can't view this in your list anymore if you delete!`,
    type: 'confirmation',
    confirmationText: 'Yes, Cancel it',
    cancelText: 'No, Revert'
  };


  deleteAddressTemplate: any = {
    title: 'Are You Sure! Want to delete Addres?',
    subtitle: `You can't view this in your list anymore if you delete!`,
    type: 'confirmation',
    confirmationText: 'Yes, Cancel it',
    cancelText: 'No, Revert'
  };

  userAddresses: any=[];
  TranslateData: boolean = false;

  constructor(private backendURLs: UtilsModule,
    private wishlistService: WishlistService,
    private fetchDataService: FetchDataService,
    fb: FormBuilder,
    private cartService: CartService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService,
    private dialogBox: DialogBoxService,
    private userService: LoginCheckService,
    private invoiceService: InvoiceTemplateService
  ) {

    this.ProfileForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control(''),
        email: fb.control('',),
        mobile: fb.control('', [Validators.pattern('^[6-9]\\d{9}$')]),
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


    this.allSubscriptions.push(
    this.DialogSubcribe = this.dialogBox.responseEmitter.subscribe((res: boolean) => {
      if (res == true ) {
        if(this.deletiontype=='order'){
        this.fetchDataService.HTTPPOST(this.backendURLs.URLs.cancelOrder, this.body).subscribe(() => {
          console.log('current page is -------->');
          this.pageChange(this.currentPage);
        })
      }
      else if(this.deletiontype=='product'){
        this.fetchDataService.HTTPPOST(this.backendURLs.URLs.cancelOrderedProduct, this.body).subscribe((data) => {
          console.log('get oirder called again------>');
          
          this.pageChange(this.currentPage);
        })
      }

      else if(this.deletiontype=='address'){
        this.fetchDataService.HTTPDELETE(this.backendURLs.URLs.deleteAddress, this.body).subscribe((data) => {
          this.userAddresses.splice(this.deletedAddressIndex, 1);
        })
      }

    }
    }));

    this.allSubscriptions.push(
    this.fetchDataService.themeColor$.subscribe((color) => {
      this.theme = color;
    }));



    this.DisableEnableForm(true);
    // this.ProfileForm.get('email')?.disable();

  };

  ngOnInit() {
    // this.showWishlistedProducts('my wishlist');
    this.allSubscriptions.push(
    this.wishlistService.showWishlistedProducts().subscribe((data) => {
      console.log(data, "wishlis data");
      
      this.wishlistedProducts = data
      console.log(this.wishlistedProducts);
      

    }))
    this.wishlistService.getWishlistCount();

  }


  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }

  DisableEnableForm(check: boolean,cancelClicked:boolean=false) {
    if (check) {
      if(cancelClicked) this.ProfileForm.patchValue(this.ProfileFormCopy);
      this.ProfileForm.disable(); 
      this.ProfileDisabled = true;
    }
    else { 
      this.ProfileForm.enable(); 
      this.ProfileDisabled = false;
    }
  }

  

  TranslateBack() {
    setTimeout(() => {
      this.TranslateData = false;
    }, 300);
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

  async saveDetails() {
    let body = {
      name: { firstname: this.ProfileForm.get('firstname')?.value, lastname: this.ProfileForm.get('lastname')?.value },
      mobile: this.ProfileForm.get('mobile')?.value,
      "info.gender": this.ProfileForm.get('gender')?.value,
      "info.dob": new Date(this.ProfileForm.get('dob')?.value)
    }
    this.fetchDataService.HTTPPATCH(this.backendURLs.URLs.updateDetails, body).subscribe((data) => {
      this.DisableEnableForm(true);
      this.userService.updateDetails(body);
    });


  }

  // wishlist work 
  
  showWishlists() {
    this.toggleAccordian(0);
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.showWishlist).subscribe((data: any) => {
      this.productsArray = data.wishlists;
      this.loading = false;
      this.wishlistCount = data.count
    })
  }

  removeWishlist(id:String) {
    this.wishlistService.removeWishlist({ id }).subscribe((data: any) => {
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

  removeFromWishlist(productId: any, wishlistName: string) {

    this.wishlistService.removeFromWishlist(productId, wishlistName).subscribe((res: any) => {

      console.log(res, "remove response");

      if (res.response.modifiedCount) {
        this.wishlistedProducts = res.data;
        this.wishlistService.getWishlistCount()
        this.toastService.warningToast({ title: 'Product removed!'})

      }
    });

  }

  moveToCart(product: any) {
    this.cartService.addToCart(product);
  }

  //  ADDRESS
  getAddresses() {
    this.showData = 'addresses';
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getAddress)
      .subscribe(
        
       {
        next: (data: any) => {
        if (data) {
          data = data.addresses;
          // this.AddressLength = data.length;
          if (data.length != 0) {
            this.userAddresses = data;
          }
        }
        this.loading=false;
      }
    ,
    error:(error)=>{
      this.loading=false;
    }

  }


      )
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
      // this.AddressLength = this.userAddresses.length;
    }
    // // new address added
    else {
      this.userAddresses = event;
      // this.AddressLength = this.userAddresses.length;
    }

  }


  deletedAddressIndex!:number
  RemoveAddress(id: string,index:number) {
    let params = new HttpParams();
    params = params.set("address_id", id);
    
    this.body=params;
    this.deletiontype='address';
    this.deletedAddressIndex=index;
    this.template = {
      title: 'Delete Address',
      subtitle: 'Are you sure you want to delete the address?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    // const body = { address_id: address._id }
    this.dialogBox.confirmationDialogBox(this.template);


  }

  EditAddress(address: any, index: any) {
    const data = this.userAddresses[index];
    console.log('data is ',data);
    
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
      this.toastService.successToast({ title: data.message })
      this.changePasswordForm.reset()
    });
  }

  async MakeDefault( index: number) {
      const body = {index };
      this.fetchDataService.HTTPPATCH(this.backendURLs.URLs.setDefaultAddress, body).subscribe((data) => {
        let defaultAddress=this.userAddresses[0];
        this.userAddresses[0]=this.userAddresses[index];
        this.userAddresses[index]=defaultAddress;
        this.toastService.successToast(data);
      });
  }

  // orders code 
  getOrders() {
    console.log('get order called');
    
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.getParticularUserOrders, this.TemplatePagination).subscribe((data: any) => {
      if (!data.length) {
        this.totalCount = 0;
        this.AllOrders = '';
      }
      else {
        this.AllOrders = data[0]?.document;
        console.log('all order assigned new ',this.AllOrders);
        this.totalCount = data?.length;
      }
      this.loading = false;
    });
  }

  getCancelledOrders() {
    // this.TranslateData = true;
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.getParticularUserOrders, this.cancelledTempatePagination).subscribe((data: any) => {
      if (!data.length) {
        this.cancelledOrdersCount = 0;
      }
      else {
        this.CancelledOrders = data[0]?.document;
        this.cancelledOrdersCount = data[0]?.count;
      }
      this.loading = false;
    });


  }

  getDate(orderDate: any) {
    return orderDate.split('T')[0];
  }

  BuyAgain(product: any) {
    this.cartService.addToCart(product);
  }


  CancelProduct(id: any, product: any) {
    this.body = { id, product }
    this.deletiontype='product';
    this.template = {
      title: 'Cancel Ordered Product',
      subtitle: 'Are you sure you want to remove product from the order?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBox.confirmationDialogBox(this.template);

  }

  pageChange(pageNo: number) {
    
    this.currentPage = pageNo;
    console.log(this.currentPage," helo hi--->");
    this.getOrders();
  }

  pageChangeCancelledOrders(pageNo: number) {
    this.cancelledCurrentPage = pageNo;
    this.getCancelledOrders()
  }

  invoiceId: any = '';

  viewInvoice(index: number) {
    console.log(this.AllOrders[index]);

    // let data = JSON.parse(JSON.stringify(this.AllOrders[index]));
    // let totalQty = 0;

    // data.products.forEach((product: any) => {
    //   totalQty += product.quantity;
    // });

    // data.orderDate = new Date(data.orderDate).toDateString()
    // data['totalQty'] = totalQty;
    // this.invoiceData = data;

    // this.invoiceService.open();
  }

  deletiontype!:String
  cancelOrder(orderId: String) {
    this.deletiontype='order';
    // let body = { orderId };
    this.body={orderId};
    let template: any = {
      title: 'Cancel Order',
      subtitle: 'Are you sure you want to cancel the order?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBox.confirmationDialogBox(this.template);

  }
 
  changeComponent(el: string) {
    this.showData = el;
    if(el=='profile'){
      this.allSubscriptions.push(
        this.fetchDataService.HTTPGET(this.backendURLs.URLs.getDetails).subscribe((data: any) => {
          data.firstname = data.name.firstname;
          data.lastname = data.name.lastname;
          data.gender = data.info.gender;
          if (data.info.dob) {
            data.dob = data.info.dob.split('T')[0];
          }
          this.ProfileFormCopy=JSON.parse(JSON.stringify(data));
          this.ProfileForm.patchValue(data);
        }));
    }
    if (this.checkAccordingClick) {
      this.AccordianIndex = 0;
      this.toggleAccordian(this.AccordianIndex);
    }
    else {
      this.toggleAccordian(this.AccordianIndex, true);
    }
    this.location.replaceState('usersetting/' + el);

    if (el == 'addresses') {
      this.loading = true;
      this.getAddresses();
    }

    if (el == 'wishlist') {
      // this.loading = true;
      // this.showWishlists();
    }
    if (el == 'orders') {
      this.loading = true;
      this.DefaultShowOrders = 'active';
      this.pageChange(1);
    }

    // this.toggleAccordian(0);
    this.TranslateData = true;
  }
}








