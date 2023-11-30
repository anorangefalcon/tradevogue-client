
import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../checkout.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { Subscription } from 'rxjs';
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
  cartitems: any = {};
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
    private userService: LoginCheckService,
    private route: ActivatedRoute,
    private stripePay: CheckoutService,
    private http: HttpClient,
    private renderer: Renderer2,
  ) {
    this.items = JSON.parse(localStorage.getItem('paymentIntent') || '[]');
    this.stripePay.setLoading = this.stripePay.setLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stripePay.showMessage = this.stripePay.showMessage.bind(this);
    this.initialize = this.initialize.bind(this);

    this.allSubscriptions.push(
      this.cartService.fetchCart().subscribe((data) => {
        this.cartitems = data;
      }));

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
  }
  ngOnInit(): void {
    this.loadRazorpayScript();
    this.allSubscriptions.push(
      this.checkOutService.loadStripe.subscribe((isLoaded: any) => {        
        this.StripeOpener = isLoaded;
        if (isLoaded) {
          this.loadStripe();
        }
      }));

    try {
      this.getAddresses();
    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }
  }
  // ngOnDestroy(){
  //   this.checkOutService.StripePaymentOpen.unsubscribe();
  // }

  async loadStripe(): Promise<void> {
    try {
      const response = await fetch(this.backendURLs.URLs.getPaymentKeys);
      const data = await response.json();
      const publicKey = data[0]?.keys?.[0]?.publicKey;
      if (publicKey) {
        this.stripeScript = this.renderer.createElement('script');
        this.stripeScript.src = 'https://js.stripe.com/v3/';
        this.stripeScript.async = true;

        this.stripeScript.onload = async () => {
          this.stripe = Stripe(publicKey);
          await this.initializeStripe();
          await this.proceedToPayment();
        };
        this.renderer.appendChild(document.body, this.stripeScript);
        // document.body.appendChild(script);
      } else {
        console.error('Public key not found');
      }
    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }
  }
  
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
      }
    } catch (error) {
      console.error('Error occurred:', error);
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
    this.allSubscriptions.push(
      this.route.queryParams.subscribe(params => {
        const redirectStatus = params['redirect_status'];
        if (redirectStatus === 'succeeded') {
        }
      }));
  }
  async initialize(stripe: any): Promise<void> {
    const item = JSON.parse(localStorage.getItem('paymentIntent') || '[]');

    const items =
    {

      orderId: this.checkOutService.orderID,
      items: item
    } 

    const response = await fetch("http://localhost:1000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const { clientSecret } = await response.json();
    this.clientSecret = clientSecret;
    const appearance = {
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
  // this.stripePay.checkOrderStatus()
  async handleSubmit(e: Event): Promise<void> {
    try {
      e.preventDefault();
      await this.stripePay.setLoading(true);
      // this.checkOutService.checkOrderStatus();
      const { paymentIntent, error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          // return_url: "http://localhost:4200/usersetting/orders",
          receipt_email: this.emailAddress,
        },
        redirect: 'if_required'
      });
      if (error) {
        this.stripePay.showMessage(error.message);
      } else if (paymentIntent && paymentIntent.id) {
        this.checkOutService.checkOrderStatus(this.clientSecret);
      } else {
        this.stripePay.showMessage("An unexpected error occurred.");
      }
      this.stripePay.setLoading(false);
      this.cartService.clearCart();
      // this.router.navigate(['/usersetting/orders']);

    } catch (error) {
    }
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
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
    this.visible_data.push(el);
    this.not_visible_data = this.not_visible_data.filter((e) => { return el != e })
  }
  
  clicked() {
    this.my_div?.nativeElement.classList.toggle('display_none');
  }
  //razorpay
  async submitForm(item: any): Promise<void> {
    try {
      let paymentBody = {};

      let body = {};
      this.allSubscriptions.push(
        this.userService.getUser('token').subscribe((token: any) => {
          body = {
            amount: item.price.toString(),
            items: item,
            token: token
          };
        }));

      const res = await this.http.post<any>('http://localhost:1000/razorpay/createUpiPayment', body).toPromise();
      if (res) {
        const options: PaymentOptions = {
          key: res.key_id,
          amount: res.amount,
          currency: 'INR',
          name: 'Trade Vogue',
          description: res.description,
          image: '../../assets/logo-mobile.svg',
          order_id: res.order_id,
          handler: (response: any) => {
            paymentBody = {
              newPaymentStatus: 'success',
              transactionId: response.razorpay_payment_id,
              MOP: 'razorpay',
              orderID: this.checkOutService.orderID,
            };

            this.allSubscriptions.push(
              this.fetchDataService.HTTPPOST(this.backendURLs.URLs.updateOrderStatus, paymentBody).subscribe(() => { }));
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
  // ADDRESS TS FILE---------------------
  userAddresses: any[] = [];
  receiveData: any;
  OrderSuccess: Boolean = true;
  ShowComponent: boolean = false;
  SecureNavBar: Boolean = false;
  AddressLength: number = 0;
  getAddresses() {
    this.allSubscriptions.push(
      this.fetchDataService.HTTPGET(this.backendURLs.URLs.getAddress)
        .subscribe((data: any) => {
          if (data) {
            data = data.addresses;
            this.AddressLength = data.length;
            if (data.length != 0) {
              this.userAddresses = data;
            }
          }
        }));
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
      this.AddressLength = this.userAddresses.length;
    }
    // new address added
    else {
      this.userAddresses = event;
      this.AddressLength = this.userAddresses.length;
    }
  }
  RemoveAddress(address: any, index: any) {
    const body = { address_id: address._id }
    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendURLs.URLs.deleteAddress, body).subscribe((data) => {
        this.userAddresses.splice(index, 1);
        this.AddressLength = this.userAddresses.length;
      }));
  }


  AddAddress() {
    this.ShowComponent = true;
  }
  addressDelivered!: any[];
  addressChecked: Boolean = false;
  AddressClicked(address: any) {
    this.userAddresses.forEach((el) => {
      el.selected = false;
    })
    address.selected = true;
    this.checkOutService.addressSelected = (address);
    this.addressDelivered = address;
  }

  ngOnDestroy() {

    if(this.stripeScript){
      this.renderer.removeChild(document.body, this.stripeScript);
    }

    this.allSubscriptions.forEach((item: Subscription) => {
      item.unsubscribe()});
  }
  
}