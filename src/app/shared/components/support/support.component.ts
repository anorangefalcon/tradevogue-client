import { Component, ElementRef } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { LoginCheckService } from '../../services/login-check.service';

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
  username: any= '';


  constructor(private util: UtilsModule, private fetchData: FetchDataService,
    private userService: LoginCheckService, private elementRef: ElementRef) {

  }

  ngOnInit() {
    this.loadLatestOrder();
  }

  loadLatestOrder() {
      this.showOrder = true;
      this.fetchData.HTTPGET(this.util.URLs.getParticularUserOrders).subscribe((data: any) => {
        console.log(data, "data is ");
        if (data !== null || data !== undefined) {
          this.products = data[0].products;
          this.orderDetails = data[0];
          this.loadingProducts = false;
        } else {
          return;
          console.log("No data found because you have not ordered anything yet");
        }
      });

    this.userService.getUser('name').subscribe((name: any) => {
      if (name) {
        this.username = name;
      }
      else{
        this.username = 'User';
      }
    });
  
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

  scrollToChatBot() {
    this.Clicked = true;
  console.log("scroll")
    setTimeout(() => {
      const chatBotElement = this.elementRef.nativeElement.querySelector('.orderDetail');
      if (chatBotElement) {
        chatBotElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 100);
  }


  showProductDetails(product: any) {
    this.selectedProduct = product;
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
    this.toggleChat();
  }


  onConfirmation(confirmed: boolean) {
    if (confirmed) {
      // Logic for confirmed order
    } else {
      // Logic for something else

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
    } else if (tab === 'support') {
      this.selectedTabIndex = 1;
    } else if (tab === 'help') {
      this.selectedTabIndex = 2;
    }
  }

  onYesClick() {
    this.scrollToChatBot();
    this.loadLatestOrder();
    this.showNewSection = true;
    this.Clicked = true;
  }

  onNoClick() {
    this.toggleChat();
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
    this.fetchData.HTTPGET(this.util.URLs.getParticularUserOrders).subscribe((data: any) => {
      this.previousOrders = data;
    });
    return this.previousOrders;
  }



}
