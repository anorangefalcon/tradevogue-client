
import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { CartService } from 'src/app/shared/services/cart.service';
import { CheckoutService } from '../checkout.service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { error } from 'jquery';
import { HttpParams } from '@angular/common/http';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
declare let Stripe: any;
interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    contact: string;
    name: string;
    email: string;
  };
  notes: {
    description: string;
  };
  theme: {
    color: string;
  };
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  checkoutHtml = '';
  checkoutCss = '';
  item: any = {};
  loading: boolean = true;
  cartitems: any = {};
  PaymentDetails!: any
  total: any = {};
  quantity: any = {};
  totalAmount!: number;
  elements: any;
  emailAddress: any;
  stripe: any;
  items: any;
  selectedPaymentMethod = 'stripe';
  StripeOpener: Boolean = false;
  stripeScript!: any;
  clientSecret!: any;
  allSubscriptions: Subscription[] = [];
  theme: Boolean = false;

  loadRazorpayScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    this.renderer.appendChild(document.body, script);
  }

  constructor(
    private cartService: CartService,
    private checkOutService: CheckoutService,
    private fetchDataService: FetchDataService,
    private backendURLs: UtilsModule,
    private renderer: Renderer2,
    private dialogBox: DialogBoxService,
    private toastService: ToastService,
  ) {
    // this.stripePay.setLoading = this.stripePay.setLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.stripePay.showMessage = this.stripePay.showMessage.bind(this);
    // this.initialize = this.initialize.bind(this);
    this.allSubscriptions.push(
      this.cartService.fetchCart().subscribe((data) => {
        this.cartitems = data;
      }),
      this.checkOutService.FinalPaymentAmount.asObservable().subscribe((data) => {
        if (data) {
          this.PaymentDetails = data;
        }
      }),

      this.fetchDataService.themeColor$.subscribe((color) => {
        this.theme = color;
      }),
      // this.dialogBox.responseEmitter.subscribe((res: boolean) => {
      //   console.log('response come up is ', res);
      //   if (res == true) {
      //     this.allSubscriptions.push(
      //       this.fetchDataService.HTTPDELETE(this.backendURLs.URLs.deleteAddress, this.body).subscribe((data) => {
      //         this.userAddresses.splice(this.addressDeletedIndex, 1);
      //       }));
      //   }
      // })
    )
  }

  ngOnInit() {
    this.loadRazorpayScript();
    this.allSubscriptions.push(
      this.checkOutService.loadStripe.subscribe((isLoaded: any) => {
        this.StripeOpener = isLoaded;
        if (isLoaded) {
          this.loadStripe();
        }
      }),
    );

    this.getAddresses();
  }


  loadStripe() {
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getPaymentKeys).subscribe({
      next: (response: any) => {
        console.log('response is ', response);
        const publicKey = response[0].decryptedPublicKey.toString();
        this.stripeScript = this.renderer.createElement('script');
        this.stripeScript.src = 'https://js.stripe.com/v3/';
        this.stripeScript.async = true;
        this.stripeScript.onload = () => {
          this.stripe = Stripe(publicKey);
          this.initialize();
        };
        this.renderer.appendChild(document.body, this.stripeScript);
      },
      error: () => {
      }
    })

  }

  // stripe elements loaded
  async initialize() {
    const item = this.cartitems.details.map((item: { sku: any; name: any; price: any; quantity: any }) => {
      return {
        id: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }
    })

    const items = {
      orderId: this.checkOutService.orderID,
      subTtotal: this.cartitems.amounts.total,
      saving: this.cartitems.amounts.saving,
      items: item,
    }

    const response = this.fetchDataService.HTTPPOST(this.backendURLs.URLs.createPaymentIntent, items).subscribe((data: any) => {
      this.clientSecret = data.clientSecret;
      let appearance = {
        theme: 'flat',
        variables: {
          fontLineHeight: '1.5',
          borderRadius: '10px',
          colorBackground: '#F6F8FA',
          accessibleColorOnColorPrimary: '#262626'
        },
        rules: {
          '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: 'none',
            padding: '12px',
          },
          '.Input': {
            padding: '12px',
            margin: '0 0 10px 0',
            backgroundColor: 'transparent',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            outline: '1px solid rgba(0, 0, 0, 0.2)',
          },
          '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray'
          },
          '.Input:hover': {
            borderColor: 'rgb(4, 118, 118)'
          },
          '.Tab': {
            padding: '10px 12px 8px 12px',
            border: 'none',
          },
          '.Tab:hover': {
            border: 'none',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Label': {
            fontWeight: '500',
            padding: '0 0 10px 0'
          }
        }
      };

      const appearanceForDarkTheme = {
        theme: 'flat',
        variables: {
          fontLineHeight: '1.5',
          borderRadius: '10px',
          colorBackground: '#121a21',
          accessibleColorOnColorPrimary: '#e6e6e6'
        },
        rules: {
          '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: 'none',
            padding: '12px',
          },
          '.Input': {
            padding: '12px',
            margin: '0 0 10px 0',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            outline: '1px solid rgba(255, 255, 255, 0.2)',
          },
          '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray'
          },
          '.Input:hover': {
            borderColor: 'rgb(4, 118, 118)'
          },
          '.Tab': {
            padding: '10px 12px 8px 12px',
            border: 'none',
          },
          '.Tab:hover': {
            border: 'none',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Label': {
            color: 'white',
            fontWeight: '500',
            padding: '0 0 10px 0'
          }
        }
      };

      if (this.theme) appearance = appearanceForDarkTheme;

      this.elements = this.stripe?.elements({ clientSecret: this.clientSecret, appearance });
      const linkAuthenticationElement = this.elements.create("linkAuthentication");
      linkAuthenticationElement.mount("#link-authentication-element");
      linkAuthenticationElement.on('change', (event: any) => {
        this.emailAddress = event.value.email;

        const paymentForm = document.querySelector("#payment-form");
        paymentForm?.addEventListener("submit", this.handleSubmit);
        if (event.complete) {
        } else if (event.error) {
          console.error("Payment form not found");
        }
      });
      const paymentElementOptions = { layout: "tabs" };
      const paymentElement = this.elements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
    })
  }



  async handleSubmit() {
    try {
      this.checkOutService.ProceedToPayment.next(true);
      const { paymentIntent, error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          receipt_email: this.emailAddress,
        },
        redirect: 'if_required'
      });

      if (error) {
        this.toastService.errorToast({ title: 'Please fill all details' });
        this.checkOutService.ProceedToPayment.next(false);
      }
      if (paymentIntent) {
        this.checkOutService.checkOrderStatus(this.clientSecret);
      }


    } catch (error) {

    }
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }


  //razorpay
  submitForm(): void {
    try {
      this.cartService.fetchCart().subscribe((ress) => {
        if (this.PaymentDetails?.discount) {
          this.PaymentDetails.total -= this.PaymentDetails?.discount;
        }

        const body = {
          amount: this.PaymentDetails?.total * 100,
          order_id: this.checkOutService.orderID,
          items: ress.details,
          token: "token",
        };


        this.fetchDataService.HTTPPOST(this.backendURLs.URLs.createRazorpayOrder, body).subscribe((createOrderResponse: any) => {
          if (createOrderResponse) {
            const options: PaymentOptions = {
              key: createOrderResponse.key_id,
              amount: createOrderResponse.amount,
              currency: 'INR',
              name: 'Trade Vogue',
              description: createOrderResponse.description,
              image: '../../assets/logo-mobile.svg',
              order_id: createOrderResponse.order_id,
              handler: (response: any) => {
                console.log(JSON.stringify(response))
                const paymentBody = {
                  orderId: this.checkOutService.orderID
                };


                this.fetchDataService.HTTPPOST(this.backendURLs.URLs.updateOrderStatus, paymentBody).subscribe((updateOrderStatusResponse: any) => {
                  if (updateOrderStatusResponse) {
                    this.toastService.successToast({ title: 'Order Placed' });
                    console.log(updateOrderStatusResponse, "success");
                    // this.cartService.clearCart();
                    this.checkOutService.PaymentSuccess.next(true);
                  }
                });
              },
              prefill: {
                contact: createOrderResponse.contact,
                name: createOrderResponse.name,
                email: createOrderResponse.email,
              },
              notes: {
                description: createOrderResponse.description,
              },
              theme: {
                color: '#047676',
              },
            };

            const razorpayObject = new (window as any).Razorpay(options);
            razorpayObject.on('payment.failed', (response: any) => {
              alert('Payment Failed');
            });
            razorpayObject.open();
          } else {
            alert(createOrderResponse);
          }
        });
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }



  // ADDRESS TS FILE---------------------
  userAddresses: any[] = [];
  receiveData: any;
  ShowComponent: boolean = false;
  SecureNavBar: Boolean = false;
  // AddressLength: number = 0;
  getAddresses() {
    this.loading = true;
    this.allSubscriptions.push(
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
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
            }
          }))
  }
  EditAddress(index: number) {
    const data = this.userAddresses[index];
    this.receiveData = { data, index };
    this.ShowComponent = true;
  }
  AddressHandler(event: any) {
    if (!event) {
      this.ShowComponent = event;
    }
    //edit request updated
    else if (event.index === 0 || event.index) {
      let check = false;
      if (this.userAddresses[event.index].selected) {
        check = true;
      }
      this.userAddresses[event.index] = event.data;
      if (check) this.userAddresses[event.index].selected = true;
      // this.AddressLength = this.userAddresses.length;
    }
    // new address added
    else {
      this.userAddresses = event;
      // this.AddressLength = this.userAddresses.length;
    }
  }

  addressDeletedIndex!: number
  body: any;
  dilogSub!: Subscription;
  RemoveAddress(id: string, index: number) {
    
    this.addressDeletedIndex = index;
    if (this.checkOutService.addressSelected?._id == id) {
      this.checkOutService.addressSelected = null;
    };
    
    let template = {
      title: 'Delete Address',
      subtitle: 'Are you sure you want to delete the address?',
      type: 'confirmation',
      confirmationText: 'Yes, Remove it',
      cancelText: 'No, Keep it',
    };
    this.dialogBox.confirmationDialogBox(template);
    
    let params = new HttpParams();
    params = params.set("address_id", id);
    this.body = params;
    
    this.dilogSub = this.dialogBox.responseEmitter.subscribe((res: boolean) => {
      if (res == true) {
        this.allSubscriptions.push(
          this.fetchDataService.HTTPDELETE(this.backendURLs.URLs.deleteAddress, this.body).subscribe((data) => {
            console.log('hello', data);
            
            this.userAddresses.splice(this.addressDeletedIndex, 1);
            this.dilogSub?.unsubscribe();
          }));
      }
      else{
        this.dilogSub?.unsubscribe();
      }
    });

    this.checkOutService.addressSelected = null;
    console.log(this.checkOutService.addressSelected, 'he5rererer');
    
  }


  AddAddress() {
    this.ShowComponent = true;
    this.receiveData = '';
  }


  AddressClicked(address: any) {
    this.userAddresses.forEach((el) => {
      el.selected = false;
    })
    address.selected = true;
    this.checkOutService.addressSelected = (address);
    // this.addressDelivered = address;
  }

  ngOnDestroy() {
    this.checkOutService.addressSelected = null;
    if (this.stripeScript) {
      this.renderer.removeChild(document.body, this.stripeScript);
    }
    console.log(this.allSubscriptions,);

    this.dilogSub?.unsubscribe();
    this.allSubscriptions.forEach((item: Subscription) => {
      item.unsubscribe()
    });
  }
}