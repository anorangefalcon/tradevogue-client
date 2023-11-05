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
    forgetPasswordUrl: 'http://localhost:1000/user/forget',
    updatePasswordUrl: 'http://localhost:1000/user/update',
    getDetails: 'http://localhost:1000/user/getDetails',
    updateDetails: 'http://localhost:1000/user/updateDetails',
    authorizeUrl: 'http://localhost:1000/checkUser',
    changePassword: 'http://localhost:1000/user/changePassword',
    // signupUrl:'http://localhost:5000/user/signup',
    getAddress: 'http://localhost:1000/user/getAddress',
    addAddress: 'http://localhost:1000/user/addAddress',
    subscribeMail: 'http://localhost:1000/sendMail',
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
    addproduct: 'http://localhost:1000/admin/addProduct',
    fetchProductInventory: 'http://localhost:1000/admin/fetchProducts',
    fetchProductDetails: 'http://localhost:1000/admin/fetchProductDetails',
    updateproduct: 'http://localhost:1000/admin/updateProduct',
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

    // OFFER
    createOffer: 'http://localhost:1000/offer/create',
    getOffers: 'http://localhost:1000/offer/get',
    deleteOffer: 'http://localhost:1000/offer/delete',
    updateOffer: 'http://localhost:1000/offer/update',
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

    // ORDERS
    verifyOrderSummary: 'http://localhost:1000/orders/verifyOrderSummary',
    createOrder: 'http://localhost:1000/orders/create',
    getParticularUserOrders: 'http://localhost:1000/orders/getparticularUserOrders',

    // support chat
    getTicketTitle: 'http://localhost:1000/user/getTicketTitle',
    updateTicketTitle: 'http://localhost:1000/admin/updateTicketTitle',
    addTitleToTicketType: 'http://localhost:1000/admin/addTitleToTicketType',
    deleteTicketTitle: 'http://localhost:1000/admin/deleteTicketTitle',
    getTicketType: 'http://localhost:1000/user/getTicketTitle',
    addTicket: 'http://localhost:1000/user/sendTicket',
    getAllTickets: 'http://localhost:1000/admin/getAllTicket',
    updateTicketStatus: 'http://localhost:1000/admin/updateTicketStatus',
    deleteSupportTicket: 'http://localhost:1000/admin/deleteSupportTicket',
    ticketMail: 'http://localhost:1000/ticketStatus',
    webPushDetail: 'http://localhost:1000/user/webPushDetails',

    // ------ custom-UI ------

    // Socials:http://localhost:1000/admin/getPaymentKeys
    setSocials: 'http://localhost:1000/socials/set',
    getSocials: 'http://localhost:1000/socials/get',

    //banner
    setBanners : 'http://localhost:1000/banners/setBanners',

    // payment keys 
    addPaymentKeys: 'http://localhost:1000/paymentKeys/add',
    updatePaymentKeys: 'http://localhost:1000/paymentKeys/update',
    deletePaymentKeys: 'http://localhost:1000/paymentKeys/delete',
    getPaymentKeys: 'http://localhost:1000/paymentKeys/get',

    // update the order status 
    updateOrderStatus: 'http://localhost:1000/orders/updateOrderStatus',
    getLatestProductForBuyer: 'http://localhost:1000/orders/latestOrder'
  }
}

