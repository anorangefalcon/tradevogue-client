import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../checkout.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
declare var Stripe: any;

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
  cartitems: any = {};
  total: any = {};
  quantity: any = {};
  totalAmount!: number;
  elements: any;
  emailAddress: any;
  stripe: any;
  items: any;
  selectedPaymentMethod = 'stripe';
StripeOpener:Boolean=false;
  ngOnInit(): void {    
  this.checkOutService.StripePaymentOpen$.subscribe((data)=>{
    this.StripeOpener=data;
  })
    try {
      this.route.queryParams.subscribe(async params => {
        const redirectStatus = params['redirect_status'];

        if (redirectStatus === 'succeeded') {
          await this.proceedToPayment();
        }
      });

      this.getAddresses();
      // this.load();

    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }
  }


  // private stripeLoaded = false;

  // load(): Promise<void> {
  //   if (!this.stripeLoaded) {
  //     return new Promise<void>((resolve, reject) => {
  //       const script = document.createElement('script');
  //       script.src = 'https://js.stripe.com/v3/';
  //       script.onload = () => {
  //         this.stripeLoaded = true;
  //         resolve();
  //       };
  //       script.onerror = (error) => reject(error);
  //       document.body.appendChild(script);
  //     });
  //   } else {
  //     return Promise.resolve();
  //   }
  // }

  async initializeStripe(): Promise<void> {
    try {
      if (this.stripePay.publicKey) {
        this.stripe = Stripe(this.stripePay.publicKey);
        await this.initialize(this.stripe);

        const paymentForm = document.querySelector("#payment-form");

        if (paymentForm) {
          paymentForm.removeEventListener("submit", this.handleSubmit);
          paymentForm.addEventListener("submit", this.handleSubmit);
        } else {
          console.error("Payment form not found");
        }
      } else {
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async onStripeButtonClick(): Promise<void> {
    this.selectedPaymentMethod = 'stripe';
    await this.initializeStripe();
  }

  async submitForm(item: any): Promise<void> {

    let body = {};
    this.userService.getUser('token').subscribe((token: any) => {
      body = {
        amount: item.price.toString(),
        items: item,
        token: token
      };
    })

    try {
      const res = await this.http.post<any>('http://localhost:1000/razorpay/createUpiPayment', body).toPromise();

      if (res.success) {
        const options: PaymentOptions = {
          key: res.key_id,
          amount: res.amount,
          currency: 'INR',
          name: res.product_name,
          description: res.description,
          image: 'https://dummyimage.com/600x400/000/fff',
          order_id: res.order_id,
          handler: (response: any) => {

            let paymentBody = {};
            this.userService.getUser('token').subscribe((token: any) => {
              paymentBody = {
                buyerId: token,
                newPaymentStatus: 'success',
                transactionId: response.razorpay_payment_id,
                MOP: 'razorpay',
              };
            });

            this.fetchDataService.HTTPPOST(this.backendURLs.URLs.updateOrderStatus, paymentBody).subscribe((data: any) => { });

            alert('Payment Succeeded');
          },
          prefill: {
            contact: res.contact,
            name: res.name,
            email: res.email,
          },
          notes: {
            description: res.description,
          },
          theme: {
            color: '#2300a3',
          },
        };

        const razorpayObject = new (window as any).Razorpay(options);
        razorpayObject.on('payment.failed', (response: any) => {
          alert('Payment Failed');
        });
        razorpayObject.open();
      } else {
        alert(res.msg);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }


  async proceedToPayment(): Promise<void> {
    try {
      const response = await fetch(this.backendURLs.URLs.getPaymentKeys);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const publicKey = data[0]?.keys?.[0]?.publicKey;

      if (publicKey) {
        this.stripe = Stripe(publicKey);
        this.initialize(this.stripe);

        const paymentForm = document.querySelector("#payment-form");
        if (paymentForm) {
          paymentForm.addEventListener("submit", this.handleSubmit);
        } else {
          console.error("Payment form not found");
        }
      } else {
      }
    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }

    this.route.queryParams.subscribe(params => {
      const redirectStatus = params['redirect_status'];
      if (redirectStatus === 'succeeded') {

      }
    });
  }

  async initialize(stripe: any): Promise<void> {
    const items = JSON.parse(localStorage.getItem('paymentIntent') || '[]');
    const response = await fetch("http://localhost:1000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const { clientSecret } = await response.json();

    const appearance = {
      theme: 'flat',
      variables: {
        fontFamily: 'Verdana',
        fontLineHeight: '1.5',
        borderRadius: '0',
        colorBackground: '#fff',
        focusBoxShadow: 'none',
        focusOutline: '-webkit-focus-ring-color auto 1px',
        tabIconSelectedColor: 'var(--colorText)'
      },
      rules: {
        '.Input, .CheckboxInput, .CodeInput': {
          transition: 'none',
          boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080'
        },
        '.Input': {
          padding: '12px'
        },
        '.Input--invalid': {
          color: '#DF1B41'
        },
        '.Tab, .Block, .PickerItem--selected': {
          backgroundColor: '#047676',
          boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf'
        },
        '.Tab': {
          transition: 'none'
        },
        '.Tab:hover': {
          backgroundColor: '#047676'
        },
        '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
          color: 'var(--colorText)',
          backgroundColor: '#ccc'
        },
        '.Tab:focus, .Tab--selected:focus': {
          boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          outline: 'none'
        },
        '.Tab:focus-visible': {
          outline: 'var(--focusOutline)'
        },
        '.PickerItem': {
          backgroundColor: '#dfdfdf',
          boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          transition: 'none'
        },
        '.PickerItem:hover': {
          backgroundColor: '#eee'
        },
        '.PickerItem--highlight': {
          outline: '1px solid blue'
        },
        '.PickerItem--selected:hover': {
          backgroundColor: '#dfdfdf'
        }
      }
    };

    this.elements = stripe.elements({ clientSecret, appearance });

    const linkAuthenticationElement = this.elements.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");

    linkAuthenticationElement.on('change', (event: any) => {
      this.emailAddress = event.value.email;
    });

    const paymentElementOptions = { layout: "tabs" };
    const paymentElement = this.elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
  }

  async handleSubmit(e: Event): Promise<void> {
    try {
      e.preventDefault();
      await this.stripePay.setLoading(true);

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: "http://localhost:4200/usersetting/orders",
          receipt_email: this.emailAddress,
        },
      });

      if (error && (error.type === "card_error" || error.type === "validation_error")) {
        this.stripePay.showMessage(error.message);
      } else {
        this.stripePay.showMessage("An unexpected error occurred.");
      }

      this.stripePay.setLoading(false);
    } catch (error) {

    }
  }


  constructor(
    private cartService: CartService,
    private checkOutService:CheckoutService,
    private fetchDataService: FetchDataService,
    private backendURLs: UtilsModule,
    private userService: LoginCheckService,
    private route: ActivatedRoute,
    private stripePay: CheckoutService,
    private http: HttpClient
  ) {

    this.items = JSON.parse(localStorage.getItem('paymentIntent') || '[]');
    this.proceedToPayment();

    this.stripePay.setLoading = this.stripePay.setLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stripePay.showMessage = this.stripePay.showMessage.bind(this);
    this.initialize = this.initialize.bind(this);

    this.cartService.fetchCart().subscribe((data) => {
      this.cartitems = data;
    });

    const checkSubTotal = () => {
      if (this.cartitems.amounts.subTotal !== 0) {
        this.total = this.totalAmount;
        this.quantity = this.cartitems.details.map((item: { Quantity: any; }) => item.Quantity);

        this.item = [
          {
            "id": this.cartitems.details.map((item: { sku: any; }) => item.sku),
            "name": this.cartitems.details.map((item: { name: any; }) => item.name),
            "price": this.cartitems.amounts.total,
            // "quantity": this.cartitems.details.map((item: { quantity: any; }) => item.quantity),
          }
        ];
        localStorage.setItem('paymentIntent', JSON.stringify(this.item));
      } else {
        setTimeout(checkSubTotal, 1000);
      }
    };

    checkSubTotal();

    // address checked
    this.checkOutService.addressSelected$.subscribe((data) => {

    })
  }


  // async initializeStripe(): Promise<void> {
  //   try {
  //     if (this.stripePay.publicKey) {
  //       this.stripe = Stripe(this.stripePay.publicKey);
  //       await this.initialize(this.stripe);

  //       const paymentForm = document.querySelector("#payment-form");

  //       if (paymentForm) {
  //         paymentForm.removeEventListener("submit", this.handleSubmit);
  //         paymentForm.addEventListener("submit", this.handleSubmit);
  //       } else {
  //         console.error("Payment form not found");
  //       }
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error('Error occurred:', error);
  //   }
  // }

  // async onStripeButtonClick(): Promise<void> {
  //   this.selectedPaymentMethod = 'stripe';
  //   await this.initializeStripe();
  // }

  // async submitForm(item: any): Promise<void> {

  //   let body = {};
  //   this.userService.getUser('token').subscribe((token: any) => {
  //     body = {
  //       amount: item.price.toString(),
  //       items: item,
  //       token: token
  //     };
  //   });

  //   try {
  //     const res = await this.http.post<any>('http://localhost:1000/razorpay/createUpiPayment', body).toPromise();

  //     if (res.success) {
  //       const options: PaymentOptions = {
  //         key: res.key_id,
  //         amount: res.amount,
  //         currency: 'INR',
  //         name: res.product_name,
  //         description: res.description,
  //         image: 'https://dummyimage.com/600x400/000/fff',
  //         order_id: res.order_id,
  //         handler: (response: any) => {

  //           let paymentBody = {};
  //           this.userService.getUser('token').subscribe((token: any) => {
  //             paymentBody = {
  //               buyerId: token,
  //               newPaymentStatus: 'success',
  //               transactionId: response.razorpay_payment_id,
  //               MOP: 'razorpay',
  //             };
  //           });
  //           this.fetchDataService.HTTPPOST(this.backendURLs.URLs.updateOrderStatus, paymentBody).subscribe((data: any) => { });

  //           alert('Payment Succeeded');
  //         },
  //         prefill: {
  //           contact: res.contact,
  //           name: res.name,
  //           email: res.email,
  //         },
  //         notes: {
  //           description: res.description,
  //         },
  //         theme: {
  //           color: '#2300a3',
  //         },
  //       };

  //       const razorpayObject = new (window as any).Razorpay(options);
  //       razorpayObject.on('payment.failed', (response: any) => {
  //         alert('Payment Failed');
  //       });
  //       razorpayObject.open();
  //     } else {
  //       alert(res.msg);
  //     }
  //   } catch (error) {
  //     console.error('Error creating order:', error);
  //   }
  // }


  // async proceedToPayment(): Promise<void> {
  //   try {
  //     const response = await fetch(this.backendURLs.URLs.getPaymentKeys);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     const publicKey = data[0]?.keys?.[0]?.publicKey;

  //     if (publicKey) {
  //       this.stripe = Stripe(publicKey);
  //       this.initialize(this.stripe);

  //       const paymentForm = document.querySelector("#payment-form");
  //       if (paymentForm) {
  //         paymentForm.addEventListener("submit", this.handleSubmit);
  //       } else {
  //         console.error("Payment form not found");
  //       }
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error('Error loading Stripe scripts:', error);
  //   }

  //   this.route.queryParams.subscribe(params => {
  //     const redirectStatus = params['redirect_status'];
  //     if (redirectStatus === 'succeeded') {

  //     }
  //   });
  // }

  // async initialize(stripe: any): Promise<void> {
  //   const items = JSON.parse(localStorage.getItem('paymentIntent') || '[]');
  //   const response = await fetch("http://localhost:1000/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items }),
  //   });

  //   const { clientSecret } = await response.json();

  //   const appearance = {
  //     theme: 'stripe',
  //     variables: {
  //       colorPrimary: '#0570de',
  //       colorBackground: '#ffffff',
  //       colorText: '#30313d',
  //       colorDanger: '#df1b41',
  //       fontFamily: 'Ideal Sans, system-ui, sans-serif',
  //       spacingUnit: '3px',
  //       borderRadius: '4px',
  //     },
  //     //  labels: 'floating',
  //   };

  //   this.elements = stripe.elements({ clientSecret, appearance });

  //   const linkAuthenticationElement = this.elements.create("linkAuthentication");
  //   linkAuthenticationElement.mount("#link-authentication-element");

  //   linkAuthenticationElement.on('change', (event: any) => {
  //     this.emailAddress = event.value.email;
  //   });

  //   const paymentElementOptions = { layout: "tabs" };
  //   const paymentElement = this.elements.create("payment", paymentElementOptions);
  //   paymentElement.mount("#payment-element");
  // }

  // async handleSubmit(e: Event): Promise<void> {
  //   try {
  //     e.preventDefault();
  //     await this.stripePay.setLoading(true);

  //     const { error } = await this.stripe.confirmPayment({
  //       elements: this.elements,
  //       confirmParams: {
  //         return_url: "http://localhost:4200/usersetting/orders",
  //         receipt_email: this.emailAddress,
  //       },
  //     });

  //     if (error && (error.type === "card_error" || error.type === "validation_error")) {
  //       this.stripePay.showMessage(error.message);
  //     } else {
  //       this.stripePay.showMessage("An unexpected error occurred.");
  //     }

  //     this.stripePay.setLoading(false);
  //   } catch (error) {

  //   }
  // }



  @ViewChild('mydiv') my_div: ElementRef | undefined;
  search_text: any = '';
  visible_data: any[] = [];


  not_visible_data: any[] = ['Plain', 'Relaxed', 'Solid', 'Washed'];

  remove_data(el: any) {
    this.not_visible_data.push(el);
    this.visible_data = this.visible_data.filter((e) => { return el != e })
  }

  add_data(el: any) {
    this.visible_data.push(el);
    this.not_visible_data = this.not_visible_data.filter((e) => { return el != e })

  }

  clicked() {
    this.my_div?.nativeElement.classList.toggle('display_none');
  }


  // ADDRESS TS FILE---------------------

  userAddresses: any[] = [];
  receiveData: any;
  ShowComponent: boolean = false;
  SecureNavBar:Boolean=false;


  getAddresses() {
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






  EditAddress(address: any, index: any) {
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
      this.userAddresses[event.index] = event.data;
    }
    // // new address added
    else {
      this.userAddresses = event;
    }

  }

  RemoveAddress(address: any, index: any) {
    const body = { address_id: address._id }
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.deleteAddress, body).subscribe((data) => {
      this.userAddresses.splice(index, 1);
    })
  }


  AddAddress() {
    this.ShowComponent = true;
  }
  

  addressDelivered!: any[];

  addressChecked:Boolean=false;
  AddressClicked(address:any){
    this.userAddresses.forEach((el)=>{
      el.selected=false;
    })
    address.selected = true;
    this.checkOutService.addressSelected.next(address);
    this.addressDelivered = address;
  }



}
