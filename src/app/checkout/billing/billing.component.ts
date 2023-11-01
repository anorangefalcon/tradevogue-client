import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
declare var Stripe: any;

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
          const response = await fetch('http://localhost:1000/getPaymentKeys');

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          console.log("response is public key ", data[0]?.keys[0]?.publicKey);

          if (Array.isArray(data) && data.length > 0 && data[0]?.keys && data[0].keys.length > 0) {
            const publicKey = data[0].keys[0].publicKey;
            this.stripe = Stripe(publicKey);

            this.initialize(this.stripe);
            this.checkStatus(this.stripe);

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

    } catch (error) {
      console.error('Error loading Stripe scripts:', error);
    }
  }

  async proceedToPayment() {

    try {
      const response = await fetch('http://localhost:1000/getPaymentKeys');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log("response is public key ", data[0]?.keys[0]?.publicKey);

      if (Array.isArray(data) && data.length > 0 && data[0]?.keys && data[0].keys.length > 0) {
        const publicKey = data[0].keys[0].publicKey;
        this.stripe = Stripe(publicKey);

        this.initialize(this.stripe);
        this.checkStatus(this.stripe);

        const paymentForm = document.querySelector("#payment-form");

        if (paymentForm) {
          paymentForm.addEventListener("submit", this.handleSubmit);
        } else {
          console.error("Payment form not found");
        }
      } else {
        console.log("No Public keys found");
      }



      this.route.queryParams.subscribe(params => {
        const redirectStatus = params['redirect_status'];

        if (redirectStatus === 'succeeded') {
          this.proceedToPayment();

        }
      });

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
      await this.setLoading(true);

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: "http://localhost:4200/cart",
          receipt_email: this.emailAddress,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        this.showMessage(error.message);
      } else {
        this.showMessage("An unexpected error occurred.");
      }

      this.setLoading(false);

    } catch (error) {
      console.log("error is ", error);

    }
  }

  async showMessage(messageText: any) {
    const messageContainer = document.querySelector("#payment-message");

    if (messageContainer) {
      messageContainer.classList.remove("hidden");
      messageContainer.textContent = messageText;

      setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
      }, 2000);
    }
  }

  setLoading = async (isLoading: boolean): Promise<void> => {
    const submitButton = document.querySelector("#submit") as HTMLButtonElement | null;
    const spinner = document.querySelector("#spinner");
    const buttonText = document.querySelector("#button-text");

    if (submitButton) {
      submitButton.disabled = isLoading;
    }

    if (spinner) {
      if (isLoading) {
        spinner.classList.remove("hidden");
      } else {
        spinner.classList.add("hidden");
      }
    }

    if (buttonText) {
      if (isLoading) {
        buttonText.classList.add("hidden");
      } else {
        buttonText.classList.remove("hidden");
      }
    }
  };

  async checkStatus(stripe: any): Promise<void> {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case "succeeded":
        this.showMessage("Payment succeeded!");

        await fetch('http://localhost:1000/invoiceSend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentIntent)
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log("Invoice data sent:", data);
          })
          .catch(error => {
            console.error("Error sending invoice data:", error);
          });


        console.log("Payment succeeded. Payment Intent Status:", paymentIntent);
        break;
      case "processing":
        this.showMessage("Your payment is processing.");
        console.log("Payment is processing. Payment Intent Status:", paymentIntent.status);
        break;
      case "requires_payment_method":
        this.showMessage("Your payment was not successful, please try again.");
        console.log("Payment requires a valid payment method. Payment Intent Status:", paymentIntent.status);
        break;
      default:
        this.showMessage("Something went wrong.");
        console.log("An unexpected error occurred. Payment Intent Status:", paymentIntent.status);
        break;
    }
  }

  constructor(private cartService: CartService, private fetchDataService: FetchDataService, private userService: UserServiceService, private backendURLs: UtilsModule, private renderer: Renderer2, private elementRef: ElementRef, private cookie: CookieService, private route: ActivatedRoute) {

    this.userService.totalAmount$.subscribe((data: any) => {
      this.totalAmount = data;
    })

    this.proceedToPayment();

    this.setLoading = this.setLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showMessage = this.showMessage.bind(this);
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
    this.userService.PaymentUrlVisited.next(true);




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


  // ADDRESS TS FILE---------------------
  userAddresses: any;
  navbar_scroll_style: boolean = false;
  cart: any = '';
  CouponApplied: any = '';
  DeliveredAddress: any = '';
  // async getAddresses(){
  // let data:any=await  this.fetchDataService.httpGet(this.backendURLs.URLs.getAddress);
  // this.userAddresses=data.info.address;  
  // }


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
}
