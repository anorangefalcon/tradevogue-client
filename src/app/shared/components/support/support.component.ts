import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})

export class SupportComponent {
  latestOrder: any; 
  showOrder: boolean = false;
  selectedTabIndex = 0;
  products: any[] = [];
  showTextView: boolean = false;
  messages: any[] = [];
  newMessage: string = '';
  orderDetails: any;
  selectedOrder: any;
  public loadingProducts: boolean = true;
  showNewSection: boolean = false;
  Clicked: boolean = false;
  selectedProduct: any;
  buttonsHidden: boolean = false;
  previousOrders: any[] = [];


  constructor(private util: UtilsModule, private fetchData: FetchDataService,private cookie: CookieService) {

  }

  ngOnInit() {
    setTimeout(() => {
       this.fetchData.HTTPPOST(this.util.URLs.getLatestProductForBuyer, {buyerId: this.cookie.get('userToken')}).subscribe((data: any) => {
        this.products = data.latestProduct.products;
        this.orderDetails = data.latestProduct;
        this.loadingProducts = false;
        console.log(this.products, "products")
        console.log(this.orderDetails, "order details");
        }); 
      this.showOrder = true;
    }, 5000);
  }

  responses: any = {
    "hello": "Hello, how can I help you?",
    "HI": "Hello, how can I help you?",
    "product": "Our products are high-quality and available in various sizes and colors.",
    "order": "You can check your order status by clicking <a href='/usersetting/orders'>here</a>.",
    "greeting": ["hello", "HI"],
    "thanks": "You're welcome!",
    "thank": "You're welcome!",
    "bye": "Bye!",
    "goodbye": "Bye!",
    "reach": "reach"
};




sendMessage() {
  this.messages.push({ content: this.newMessage, sender: 'user' });

  const response = this.checkKeywords(this.newMessage.toLowerCase());
  this.messages.push({ content: response, sender: 'bot' });

  this.newMessage = '';
}

noMatch: boolean = false;

checkKeywords(message: string): string {
  message = message.toLowerCase();
  for (const keyword in this.responses) {
      const currentKeyword = keyword.toLowerCase();
      if (message.includes(currentKeyword)) {
          if (currentKeyword === "when my order reaches me?") {
              if (this.orderDetails && this.orderDetails.transactionId) {
                  return `Your order with payment Id : ${this.orderDetails.transactionId}`;
              } else {
                  return "Sorry, I couldn't retrieve the transaction ID for your order.";
              }
          }
          return this.responses[keyword];
      }
  }
  this.noMatch = true;
  return "I'm sorry, I don't understand. Can you please rephrase?";
}


  showProductDetails(product: any) {
    this.selectedProduct = product;
    console.log('Clicked Product:', this.selectedProduct);
  }

  showProductDetail(order: any, product: any) {
    this.selectedOrder = order;
    this.selectedProduct = product;
  }

  onAsk() {
    this.showTextView = true;
    this.buttonsHidden = true;
  }
  onNoThanks() {

  }
  

  onConfirmation(confirmed: boolean) {
    if (confirmed) {
      // Logic for confirmed order
      console.log('Order confirmed');
    } else {
      // Logic for something else
      console.log('User wants something else');
    }
  }

  

   toggleChat() {
    const chatBtn = document.querySelector('.icon-support');
    const chatBox = document.querySelector('.messenger');

    if (chatBtn && chatBox) {
      chatBtn.classList.toggle('expanded');

      setTimeout(() => {
        chatBox.classList.toggle('expanded');
      }, 100);
    }
   }

   navigateTo(tab: string) {
    if (tab === 'home') {
      this.selectedTabIndex = 0;
    } else if (tab === 'chat') {
      this.selectedTabIndex = 1;
    } else if (tab === 'help') {
      this.selectedTabIndex = 2;
    }
  }

  onYesClick() {
    this.showNewSection = true;
    this.Clicked = true;
    // Other logic when the user clicks Yes
    
  }

  onNoClick() {
    // Other logic when the user clicks No
  }

  chatWithHuman() {

  }

  markResolved() {

  }

  orderNotListed() {
    // Assuming loadPreviousOrders is a function that fetches the user's previous orders
    this.previousOrders = this.loadPreviousOrders();
  }

  // Function to fetch previous orders
  loadPreviousOrders() {
    this.fetchData.HTTPGET(this.util.URLs.getParticularUserOrders).subscribe((data:any)=>{
      this.previousOrders=data; 
      console.log(this.previousOrders, "previous orders")  
  });  
    return this.previousOrders;
  }

  
  
}
