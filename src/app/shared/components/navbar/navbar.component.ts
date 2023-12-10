import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { FetchDataService } from "../../services/fetch-data.service";
import { NavigationEnd, Router } from "@angular/router";
import { WishlistService } from "../../services/wishlist.service";
import { UtilsModule } from "src/app/utils/utils.module";
import { LoginCheckService } from "../../services/login-check.service";
import { CheckoutService } from "src/app/checkout/checkout.service";
import { SupportNotificationService } from "../../services/support-notification.service";
import { Subscription } from "rxjs";
import { SocketService } from "../../services/socket.service";
import { CookieService } from "ngx-cookie-service";

// declare var doSignout:any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  dataSubscription!: Subscription;
  isSearching: boolean = false;
  isUserLogin: boolean = false;
  hamburgerOpen: boolean = false;
  purchaser: any = "";
  cart_count: number = 0;
  wishlistCount: number = 0;
  isLogin: boolean = false;
  darkTheme: Boolean = false;

  // notification start
  showBellIcon: boolean = true;
  fcmToken: any;
  notifications: any[] = [];
  // notification end

  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;
  shadowed: boolean = true;
  categories: any = {
    men: [],
    women: [],
  };
  secureNavbar: boolean = false;

  UserRole!: String;
  updatedNotificationArray: any;
  hasNotificationToken: any;

  constructor(
    private cartService: CartService,
    private userService: LoginCheckService,
    private checkOutService: CheckoutService,
    private BackendEndUrl: UtilsModule,
    private fetchDataService: FetchDataService,
    private wishlistService: WishlistService,
    public notification: SupportNotificationService,
    private fetchService: FetchDataService,
    private router: Router,
    private util: UtilsModule,
    private elementRef: ElementRef,
    private socketService: SocketService,
    private cookie: CookieService
  ) {
    this.hasNotificationToken = false;

    if(this.cookie.get('userToken')) {
       this.hasNotificationToken = notification.hasFcmToken.subscribe((res) => {
      if (!res) {
        return false;
      }
      return res;
    });
    }

    this.checkOutService.secureNavbar$.subscribe((data) => {
      this.secureNavbar = data;
    });

    this.userService.getUser("token").subscribe((data) => {
      if (!data) return;
      this.fetchDataService
        .HTTPGET(this.BackendEndUrl.URLs.authorizeUrl)
        .subscribe((data: any) => {
          if (data == "admin") this.UserRole = data;
        });
    });

    this.userService.getUser("name").subscribe((name: any) => {
      if (name) {
        this.purchaser = name;
      } else {
        this.purchaser = "";
      }
    });
  }

  ngOnInit() {
    const socket = this.socketService.getNotificationSocket();
    socket.on("notificationStatus", (notify: boolean) => {
      if (notify == true) {
        this.fetchNotifications();
      } else {
        this.notifications = [];
      }
    });

    if (
      this.userService.getUser().subscribe((data) => {
        this.isUserLogin = data;
      })
    )
      this.cartService.fetchCart("count").subscribe((item_count: any) => {
        this.cart_count = item_count;
      });

    this.wishlistService.WishlistCount$.subscribe((data) => {
      if (data || data == 0) {
        this.wishlistCount = data;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === "/" || this.router.url === "") {
          this.shadowed = true;
        } else {
          this.shadowed = true;
        }
      }
    });

    const body = {
      parameter: "mix",
    };

    this.fetchDataService
      .HTTPPOST(this.BackendEndUrl.URLs.uniqueProductFields, body)
      .subscribe((data: any) => {
        this.categories.men = data.data.male.category;
        this.categories.women = data.data.female.category;
      });

    this.fetchDataService.themeColor$.subscribe((color) => {
      this.darkTheme = color;
    });

    this.dataSubscription = this.fetchService
      .HTTPGET(this.util.URLs.comingNotification)
      .subscribe((res: any) => {
        this.notifications = res.filter((notificationArray: any) => {
          return notificationArray.state === true;
        });
      });
  }

  fetchNotifications() {
    this.dataSubscription = this.fetchService
      .HTTPGET(this.util.URLs.comingNotification)
      .subscribe((res: any) => {
        this.notifications = res.filter((notificationArray: any) => {
          return notificationArray.state === true;
        });
      });
  }

    // notification start
  async subscribeToNotifications() {
    this.notification.initialize();
  }

  searchExplore(query: string) {
    if (query == "") {
      this.router.navigateByUrl(`/explore`);
    } else {
      this.router.navigateByUrl(`/explore?search=${query}`);
    }
  }

  onLogout() {
    this.userService.logoutUser();
  }

  @HostListener("window:scroll", []) onScroll() {
    if (window.scrollY > 40) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    this.fetchDataService.toggleTheme(this.darkTheme);
  }

redirectToUrl(url: string) {
  const decodedUrl = decodeURIComponent(url);

  const baseUrl = window.location.origin;
  const isAbsoluteUrl = decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://');

  if (isAbsoluteUrl) {
    window.location.href = decodedUrl;
  } else {
    if (decodedUrl.startsWith(baseUrl)) {
      const path = decodedUrl.substring(baseUrl.length);
      this.router.navigateByUrl(path);
    } else {
      this.router.navigateByUrl(decodedUrl);
    }
  }
}




  @HostListener("document:click", ["$event"]) onClick(e: Event) {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.isSearching = false;
    }
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
