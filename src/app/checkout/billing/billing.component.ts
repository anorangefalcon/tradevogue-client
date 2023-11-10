import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { BillingResponseService } from '../billing-response.service';
declare var Stripe: any;
import { StripPaymentService } from 'src/app/shared/services/stripe-Integration/strip-payment.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

  checkoutHtml: string = '';
  checkoutCss: string = '';
  item: any = {};
  cartitems: any = {}
  total: any = {}
  quantity: any = {}
  totalAmount!: number;
  elements: any;
  emailAddress: any;
  stripe: any;

  async ngOnInit(): Promise<void> {
    try {

      window.onload = async () => {
        try {

          if (this.stripePay.publicKey) {
            this.stripe = Stripe(this.stripePay.publicKey);

            this.initialize(this.stripe);

            const paymentForm = document.querySelector("#payment-form");

            if (paymentForm) {
              paymentForm.addEventListener("submit", this.handleSubmit);
            } else {
              console.error("Payment form not found");
            }
          } else {
            console.log("No Public keys found");
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      };

      this.route.queryParams.subscribe(params => {
        const redirectStatus = params['redirect_status'];

        if (redirectStatus === 'succeeded') {
          this.proceedToPayment();
        }
      });

      this.getAddresses();

    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }
  }

  async proceedToPayment() {

    try {
      const response = await fetch(this.backendURLs.URLs.getPaymentKeys);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log("response is public key ", data[0]?.keys[0]?.publicKey);

      if (Array.isArray(data) && data.length > 0 && data[0]?.keys && data[0].keys.length > 0) {
        const publicKey = data[0].keys[0].publicKey;
        console.log("service payment key", this.stripePay.publicKey);
        this.stripe = Stripe(publicKey);

        this.initialize(this.stripe);

        const paymentForm = document.querySelector("#payment-form");

        if (paymentForm) {
          paymentForm.addEventListener("submit", this.handleSubmit);
        } else {
          console.error("Payment form not found");
        }
      } else {
        console.log("No Public keys found");
      }
    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }

    await this.route.queryParams.subscribe(params => {
      const redirectStatus = params['redirect_status'];

      if (redirectStatus === 'succeeded') {
        console.log('Success from vivek');

      }
    });
  }
  // constructor(private cookie: CookieService, private fetchDataService: FetchDataService, private cartService:CartService, private userService: UserServiceService, private backendURLs: UtilsModule) {
  // this.userService.PaymentUrlVisited.next(true);
  //   this.getAddresses();
  // }


  async initialize(stripe: any): Promise<void> {
    const items = JSON.parse(localStorage.getItem('paymentIntent') || '[]');
    const response = await fetch("http://localhost:1000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const { clientSecret } = await response.json();
    console.log("Client Secret:", clientSecret);

    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '3px',
        borderRadius: '4px',
      },
      //  labels: 'floating',
    };
    this.elements = stripe.elements({ clientSecret, appearance });

    const linkAuthenticationElement = this.elements.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");

    linkAuthenticationElement.on('change', (event: any) => {
      this.emailAddress = event.value.email;
    });

    const paymentElementOptions = {
      layout: "tabs",
    };

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

      if (error.type === "card_error" || error.type === "validation_error") {
        this.stripePay.showMessage(error.message);
      } else {
        this.stripePay.showMessage("An unexpected error occurred.");
      }

      this.stripePay.setLoading(false);

    } catch (error) {
      console.log("error is ", error);

    }
  }

  constructor(private cartService: CartService, private billingService: BillingResponseService, private fetchDataService: FetchDataService, private backendURLs: UtilsModule, private renderer: Renderer2, private elementRef: ElementRef, private cookie: CookieService, private route: ActivatedRoute, private stripePay: StripPaymentService) {

    // this.userService.totalAmount$.subscribe((data: any) => {
    //   this.totalAmount = data;
    // })
    this.billingService.BillingPageVisited.next(true);
    this.proceedToPayment();

    this.stripePay.setLoading = this.stripePay.setLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.stripePay.showMessage = this.stripePay.showMessage.bind(this);
    this.initialize = this.initialize.bind(this);

    this.cartService.fetchCart().subscribe((data) => {

      this.cartitems = data;
      console.log("cart items are: ", this.cartitems)
    });
    const checkSubTotal = () => {
      if (this.cartitems.amounts.subTotal !== 0) {
        this.total = this.totalAmount;
        this.quantity = this.cartitems.details.map((item: { Quantity: any; }) => item.Quantity);
        console.log("Total:", this.total, "Quantity:", this.quantity);

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
    // this.userService.PaymentUrlVisited.next(true);

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
  userAddresses: any[] = [];
  receiveData: any;
  navbar_scroll_style: boolean = false;
  cart: any = '';
  CouponApplied: any = '';
  DeliveredAddress: any = '';
  ShowComponent: boolean = false;



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


  // async getAddresses() {;
  //   let Addresses = await this.userService.SubscribingValue('userAddresses');
  //   if (!Addresses) {
  //     let data: any = await this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
  //     data = data.addresses;
  //     this.userAddresses = data;
  //     if (data.length != 0) {
  //       await this.userService.emittingValue('userAddresses', data);
  //       this.userAddresses = data;
  //     }
  //   }

  //   else {
  //     this.userAddresses = Addresses;
  //   }


  // }




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

  SelectAddress(address: any) {
    this.DeliveredAddress = address;
    this.billingService.Address = this.DeliveredAddress;
  }

  ChangeAddress() {
    this.DeliveredAddress = false;
  }

  async MakeDefault(address: any, i: any) {
    const body = { address_id: address._id };
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.setDefaultAddress, body).subscribe((update: any) => {
      this.userAddresses = update[0].info.address;
    });
  }
}
