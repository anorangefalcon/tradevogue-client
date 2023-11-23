import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ]
})

export class UtilsModule {

  URLs: any = {
    signupUrl: 'http://localhost:1000/user/signup',
    loginUrl: 'http://localhost:1000/user/login',
    subscribeMail: 'http://localhost:1000/user/subscribe',
    forgetPasswordUrl: 'http://localhost:1000/user/forget',
    updatePasswordUrl: 'http://localhost:1000/user/update',
    getDetails: 'http://localhost:1000/user/getDetails',
    updateDetails: 'http://localhost:1000/user/updateDetails',
    authorizeUrl: 'http://localhost:1000/checkUser',
    changePassword: 'http://localhost:1000/user/changePassword',
    // signupUrl:'http://localhost:5000/user/signup',
    getAddress: 'http://localhost:1000/user/getAddress',
    addAddress: 'http://localhost:1000/user/addAddress',
    updateAddress: 'http://localhost:1000/user/updateAdress',
    deleteAddress: 'http://localhost:1000/user/deleteAddress',
    setDefaultAddress: 'http://localhost:1000/user/setDefault',
    getCoupons: 'http://localhost:1000/offer/getCoupons',
    // getAddress:'http://localhost:1000/user/getAddress',
    // addAddress:'http://localhost:1000/user/addAddress',
    // subscribeMail : 'http://localhost:1000/sendMail',
    // updateAddress:'http://localhost:1000/user/updateAdress',
    // deleteAddress:'http://localhost:1000/user/deleteAddress',
    // setDefaultAddress:'http://localhost:1000/user/setDefault',
   

    // Dashboard
    fetchOverallData: 'http://localhost:1000/admin/getOverallInfo',
    fetchSalesStats: 'http://localhost:1000/admin/fetchSalesData',
    fetchCategoryStats: 'http://localhost:1000/admin/fetchCategoryData',
    fetchReviewStats: 'http://localhost:1000/admin/fetchReviewData',
    fetchPopularProducts: 'http://localhost:1000/admin/fetchPopularProducts',

    addproduct: 'http://localhost:1000/admin/addProduct',
    fetchProductInventory: 'http://localhost:1000/admin/fetchProducts',
    fetchProductDetails: 'http://localhost:1000/admin/fetchProductDetails',
    updateproduct: 'http://localhost:1000/admin/updateProduct',
    highlightProduct: 'http://localhost:1000/admin/updatehighlightProduct',
    deleteproducts: 'http://localhost:1000/admin/deleteProducts',
    fetchFeatures: 'http://localhost:1000/admin/fetchProductFeatures',
    updateFeatures: 'http://localhost:1000/admin/updateProductFeature',
    updateAccount: 'http://localhost:1000/admin/updateDetails',
    getAccount: 'http://localhost:1000/admin/getadminDetails',
    getSellerOrders: 'http://localhost:1000/orders/sellerOrders',
    getSellerOrderDetails: 'http://localhost:1000/orders/sellerOrderDetail',
    getOrderOverallData: 'http://localhost:1000/orders/getOrderOverallData',

    // stripe
    stripePayment: 'http://localhost:1000/user/create-payment-intent',

    // products
    fetchProducts: 'http://localhost:1000/products/fetch',
    fetchProductUrl: 'http://localhost:1000/products/fetchProduct',
    uniqueProductFields: 'http://localhost:1000/products/uniqueFields',
    getOriginalProductPrice: 'http://localhost:1000/products/getOriginalPrice',
    // getProductPrice:'http://localhost:1000/admin/getProductPrice',

    // product reviews
    addOrUpdateReview: 'http://localhost:1000/reviews/addOrUpdate',
    deleteReview: 'http://localhost:1000/reviews/delete',

    // CART
    fetchCart: 'http://localhost:1000/cart/fetch',
    addItemsToCart: 'http://localhost:1000/cart/add',
    removeItemFromCart: 'http://localhost:1000/cart/remove',
    updateItemFromCart: 'http://localhost:1000/cart/update',
    clearCart: 'http://localhost:1000/cart/clear',
    removeItems: 'http://localhost:1000/cart/removeItems',

    // OFFER
    createOffer: 'http://localhost:1000/offer/create',
    getOffers: 'http://localhost:1000/offer/get',
    deleteOffer: 'http://localhost:1000/offer/delete',
    updateOffer: 'http://localhost:1000/offer/update',
    updateOfferStatus:'http://localhost:1000/offer/statusUpdate',
    searchOffer:'http://localhost:1000/offer/search',
    // createOffer:'http://localhost:1000/offer/create',
    // getOffers:'http://localhost:1000/offer/get',
    // deleteOffer:'http://localhost:1000/offer/delete',
    // updateOffer:'http://localhost:1000/offer/update',
    // getCoupons:'http://localhost:1000/offer/getCoupons',

    // FAQs User Routes
    getFaqData: 'http://localhost:1000/getpaginatedData/faq',

    // FAQS Admin Routes
    updateFaqData: 'http://localhost:1000/faqs/update',
    deleteFaqData: 'http://localhost:1000/faqs/delete',
    addFaqData: 'http://localhost:1000/faqs/add',

    // pagination common
    getPaginatedData: 'http://localhost:1000/getPaginatedData',
    
    //wishlists
    showWishlist: 'http://localhost:1000/wishlist/showWishlist',
    addNewWishlist: 'http://localhost:1000/wishlist/addWishlist',
    addToWishlist: 'http://localhost:1000/wishlist/addToWishlist',
    showWishlistCount: 'http://localhost:1000/wishlist/showWishlistCount',
    showProducts: 'http://localhost:1000/wishlist/showWishlistProducts',
    deleteFromWishlist: 'http://localhost:1000/wishlist/deleteFromWishlist',
    removeWishlist : 'http://localhost:1000/wishlist/deleteWishlist',

    // ORDERS
    verifyOrderSummary: 'http://localhost:1000/orders/verifyOrder',
    createOrder: 'http://localhost:1000/orders/create',
    updateOrder:'http://localhost:1000/orders/update',
    getParticularUserOrders: 'http://localhost:1000/orders/getparticularUserOrders',
    cancelOrder: 'http://localhost:1000/orders/cancelOrder',
    verifyOrderWithoutCoupon:'http://localhost:1000/orders/verifyOrderWithoutCoupon',

    // support, ticket 
    getTicketStatus: 'http://localhost:1000/ticket/get',
    webPushTokenDetail: 'http://localhost:1000/ticket/tokenDetails',
    saveTicket: 'http://localhost:1000/ticket/send',
    updateTitle: 'http://localhost:1000/ticket/updateTitle',
    addTicketTitle: 'http://localhost:1000/ticket/addTitle',
    deleteTitle: 'http://localhost:1000/ticket/deleteTitle',
    getAllTicket: 'http://localhost:1000/ticket/getall',
    updateTicket: 'http://localhost:1000/ticket/updateTicket',
    deleteTicket: 'http://localhost:1000/ticket/deleteTicket',
    ticketMail: 'http://localhost:1000/ticketStatus',


    // notifications
    getFcmToken: 'http://localhost:1000/notification/getfcmToken',
    getNotification: 'http://localhost:1000/notification/get',
    setNotifications: 'http://localhost:1000/notification/set',
    updateNotification: 'http://localhost:1000/notification/update',
    toggleNotification: 'http://localhost:1000/notification/toggle',
    comingNotification: 'http://localhost:1000/notification/coming',

    // ------ custom-UI ------

    // Home-Layout
    getHomeLayout: 'http://localhost:1000/homeLayout/get',
    getAllHomeLayouts: 'http://localhost:1000/homeLayout/getAll',
    createOrUpdateHomeLayout: 'http://localhost:1000/homeLayout/updateOrCreate',
    deleteHomeLayout: 'http://localhost:1000/homeLayout/delete',
    
    // Socials
    setSocials: 'http://localhost:1000/socials/set',
    getSocials: 'http://localhost:1000/socials/get',

    //banner
    setBanners : 'http://localhost:1000/banners/setBanners',
    getBanners : 'http://localhost:1000/banners/getBanners',
    deleteBanner : 'http://localhost:1000/banners/deleteBanner',
    updateBanner : 'http://localhost:1000/banners/updateBanner',
    toggleBanner : 'http://localhost:1000/banners/toggleBanner',

    // deals
    setDeals:'http://localhost:1000/deals/set',
    getDealsDetails:'http://localhost:1000/deals/getDetails',

    // about
    setAboutDetails:'http://localhost:1000/about/setDetails',
    getAboutDetails:'http://localhost:1000/about/getDetails',
    // sale 
    setSales: 'http://localhost:1000/sales/setSales',
    getSales: 'http://localhost:1000/sales/getSales',
    toggleSales: 'http://localhost:1000/sales/toggle',
    updateSales: 'http://localhost:1000/sales/update',
    deleteSales: 'http://localhost:1000/sales/delete',

    // payment keys 
    addPaymentKeys: 'http://localhost:1000/paymentKeys/add',
    updatePaymentKeys: 'http://localhost:1000/paymentKeys/update',
    deletePaymentKeys: 'http://localhost:1000/paymentKeys/delete',
    getPaymentKeys: 'http://localhost:1000/paymentKeys/get',

    // razorpay
    razorpayPayment: 'http://localhost:1000/razorpay/createUpiPayment',

    // redis 
    getClientSecret: 'http://localhost:1000/paymentKeys/get-redis-data',

    // update the order status 
    updateOrderStatus: 'http://localhost:1000/orders/updateOrderStatus',
    // getLatestProductForBuyer: 'http://localhost:1000/orders/latestOrder',

    // T&C
    getTandC:'http://localhost:1000/tc/get',
  }
}

