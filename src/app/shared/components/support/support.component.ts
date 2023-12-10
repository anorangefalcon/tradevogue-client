import { Component, ElementRef } from "@angular/core";
import { UtilsModule } from "src/app/utils/utils.module";
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { LoginCheckService } from "../../services/login-check.service";
import { CookieService } from "ngx-cookie-service";
import { SocketService } from "../../services/socket.service";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.css"],
})
export class SupportComponent {
  latestOrder: any;
  selectedTabIndex = 0;
  products: any[] = [];
  showTextView: boolean = false;
  messages: any[] = [];
  newMessage: string = "";
  orderDetails: any;
  selectedOrder: any;
  productPresent: boolean = false;
  public loadingProducts: boolean = true;
  showNewSection: boolean = false;
  Clicked: boolean = false;
  selectedProduct: any;
  buttonsHidden: boolean = false;
  previousOrders: any[] = [];
  username: any = "";
  message: string = "";
  id: string = "";
  textMessage: string = "";
  name: any;
  email: any;
  userData: any = [];
  senderId: any;
  selectedUser: any;
  replyAdminMessage: any;
  usermessage: any;

  constructor(
    private util: UtilsModule,
    private fetchData: FetchDataService,
    private userService: LoginCheckService,
    private elementRef: ElementRef,
    private cookieService: CookieService,
    private socketService: SocketService
  ) {
    const token = this.cookieService.get("userToken");
    if (!token) {
      return;
    }
    if (token) {
      const socket = this.socketService.getChatSocket();
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payload = JSON.parse(decodedPayload);
        console.log(payload, "payload is");
        console.log(this.usermessage, "user message is ");
        
        socket.on("replymessage", (data: { message: any; sender: any }) => {
          console.log("Received admin message:", data);
          const body = {
            message: data.message,
            receiver: payload.id,
          };

          socket.emit("saveadminMessage", body);
          if (data.sender == payload.id) {
            this.replyAdminMessage = data.message;
            this.messages.push({
              content: this.replyAdminMessage,
              sender: "admin",
            });
          }
        });

        // Use the payload data as needed
      } else {
        console.error("Invalid token format");
      }
    } else {
      console.error("Token not found");
    }
  }

  ngOnInit() {
    const socket = this.socketService.getChatSocket();
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("connect_error", (error: any) => {
      console.error("Connection error:", error);
    });

    socket.on("userMessage", (res: { message: any }) => {
      console.log(res);
      this.usermessage = res.message;
      socket.emit("newChat", res);
    });
  }

  loadLatestOrder() {
    // this.fetchData
    //   .HTTPGET(this.util.URLs.getIndividualOrders)
    //   .subscribe((data: any) => {
    //     console.log(data, "data is");
    //     if (Array.isArray(data) && data.length !== 0) {
    //       this.products = data[0].products;
    //       this.orderDetails = data[0];
    //       this.productPresent = true;
    //     }
    //     this.loadingProducts = false;
    //   });

    this.userService.getUser("name").subscribe((name: any) => {
      if (name) {
        this.username = name;
      } else {
        this.username = "User";
      }
    });
  }

  // responses: any = {
  //   hello: "Hello, how can I help you?",
  //   HI: "Hello, how can I help you?",
  //   product:
  //     "Our products are high-quality and available in various sizes and colors.",
  //   order:
  //     "You can check your order status by clicking <a href='/usersetting/orders'>here</a>.",
  //   greeting: ["hello", "HI"],
  //   thanks: "You're welcome!",
  //   thank: "You're welcome!",
  //   bye: "Bye!",
  //   goodbye: "Bye!",
  //   reach: "reach",
  // };

  // sendMessage() {
  //   this.messages.push({ content: this.newMessage, sender: "user" });

  //   const response = this.checkKeywords(this.newMessage.toLowerCase());
  //   this.messages.push({ content: response, sender: "bot" });
  // }

  noMatch: boolean = false;

  // checkKeywords(message: string): string {
  //   message = message.toLowerCase();
  //   for (const keyword in this.responses) {
  //     const currentKeyword = keyword.toLowerCase();
  //     if (message.includes(currentKeyword)) {
  //       if (currentKeyword === "when my order reaches me?") {
  //         if (this.orderDetails && this.orderDetails.transactionId) {
  //           return `Your order with payment Id : ${this.orderDetails.transactionId}`;
  //         } else {
  //           return "Sorry, I couldn't retrieve the transaction ID for your order.";
  //         }
  //       }
  //       return this.responses[keyword];
  //     }
  //   }
  //   this.noMatch = true;
  //   return "I'm sorry, I don't understand. Can you please rephrase?";
  // }

  // scrollToChatBot() {
  //   this.Clicked = true;
  //   console.log("scroll");
  //   setTimeout(() => {
  //     const chatBotElement =
  //       this.elementRef.nativeElement.querySelector(".orderDetail");
  //     if (chatBotElement) {
  //       chatBotElement.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //         inline: "nearest",
  //       });
  //     }
  //   }, 100);
  // }

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

  sendLiveMessage() {
    const socket = this.socketService.getChatSocket();

    const token = this.cookieService.get("userToken");
    if (token) {
      this.messages.push({ content: this.textMessage, sender: "user" });

      socket.emit("newMessage", this.textMessage);
      this.textMessage = "";
    } else {
      console.error("Invalid token format");
    }
  }

  toggleChat() {
    const chatBtn = document.querySelector(".icon-support");
    const chatBox = document.querySelector(".messenger");

    if (chatBtn && chatBox) {
      chatBtn.classList.toggle("expanded");

      setTimeout(() => {
        chatBox.classList.toggle("expanded");
      }, 100);
    }
  }

  navigateTo(tab: string) {
    if (tab === "home") {
      this.selectedTabIndex = 0;
    } else if (tab === "support") {
      this.selectedTabIndex = 1;
    } else if (tab === "help") {
      this.selectedTabIndex = 2;
    }
  }

  // onYesClick() {
  //   this.scrollToChatBot();
  //   this.showNewSection = true;
  //   this.Clicked = true;
  // }

  onNoClick() {
    this.toggleChat();
  }

  chatWithHuman() {}

  markResolved() {}
}
