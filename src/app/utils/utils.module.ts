import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ]
})

export class UtilsModule {

  URLs: any = {
    signupUrl: 'https://tradevogue-backend.onrender.com/user/signup',
    loginUrl: 'https://tradevogue-backend.onrender.com/user/login',
    forgetPasswordUrl: 'https://tradevogue-backend.onrender.com/user/forget',
    updatePasswordUrl: 'https://tradevogue-backend.onrender.com/user/update',
    getDetails: 'https://tradevogue-backend.onrender.com/user/getDetails',
    updateDetails: 'https://tradevogue-backend.onrender.com/user/updateDetails',
    authorizeUrl: 'https://tradevogue-backend.onrender.com/checkUser',
    changePassword: 'https://tradevogue-backend.onrender.com/user/changePassword',
    // signupUrl:'http://localhost:5000/user/signup',
    getAddress: 'https://tradevogue-backend.onrender.com/user/getAddress',
    addAddress: 'https://tradevogue-backend.onrender.com/user/addAddress',
    subscribeMail: 'https://tradevogue-backend.onrender.com/sendMail',
    updateAddress: 'https://tradevogue-backend.onrender.com/user/updateAdress',
    deleteAddress: 'https://tradevogue-backend.onrender.com/user/deleteAddress',
    setDefaultAddress: 'https://tradevogue-backend.onrender.com/user/setDefault',
    getCoupons: 'https://tradevogue-backend.onrender.com/offer/getCoupons',
    // getAddress:'https://tradevogue-backend.onrender.com/user/getAddress',
    // addAddress:'https://tradevogue-backend.onrender.com/user/addAddress',
    // subscribeMail : 'https://tradevogue-backend.onrender.com/sendMail',
    // updateAddress:'https://tradevogue-backend.onrender.com/user/updateAdress',
    // deleteAddress:'https://tradevogue-backend.onrender.com/user/deleteAddress',
    // setDefaultAddress:'https://tradevogue-backend.onrender.com/user/setDefault',
   

    // Dashboard
    fetchOverallData: 'https://tradevogue-backend.onrender.com/admin/getOverallInfo',
    fetchSalesStats: 'https://tradevogue-backend.onrender.com/admin/fetchSalesData',
    fetchCategoryStats: 'https://tradevogue-backend.onrender.com/admin/fetchCategoryData',
    fetchReviewStats: 'https://tradevogue-backend.onrender.com/admin/fetchReviewData',
    fetchPopularProducts: 'https://tradevogue-backend.onrender.com/admin/fetchPopularProducts',

    addproduct: 'https://tradevogue-backend.onrender.com/admin/addProduct',
    fetchProductInventory: 'https://tradevogue-backend.onrender.com/admin/fetchProducts',
    fetchProductDetails: 'https://tradevogue-backend.onrender.com/admin/fetchProductDetails',
    updateproduct: 'https://tradevogue-backend.onrender.com/admin/updateProduct',
    highlightProduct: 'https://tradevogue-backend.onrender.com/admin/updatehighlightProduct',
    deleteproducts: 'https://tradevogue-backend.onrender.com/admin/deleteProducts',
    fetchFeatures: 'https://tradevogue-backend.onrender.com/admin/fetchProductFeatures',
    updateFeatures: 'https://tradevogue-backend.onrender.com/admin/updateProductFeature',
    updateAccount: 'https://tradevogue-backend.onrender.com/admin/updateDetails',
    getAccount: 'https://tradevogue-backend.onrender.com/admin/getadminDetails',
    getSellerOrders: 'https://tradevogue-backend.onrender.com/orders/sellerOrders',
    getSellerOrderDetails: 'https://tradevogue-backend.onrender.com/orders/sellerOrderDetail',
    getOrderOverallData: 'https://tradevogue-backend.onrender.com/orders/getOrderOverallData',

    // stripe
    stripePayment: 'https://tradevogue-backend.onrender.com/user/create-payment-intent',

    // products
    fetchProducts: 'https://tradevogue-backend.onrender.com/products/fetch',
    fetchProductUrl: 'https://tradevogue-backend.onrender.com/products/fetchProduct',
    uniqueProductFields: 'https://tradevogue-backend.onrender.com/products/uniqueFields',
    getOriginalProductPrice: 'https://tradevogue-backend.onrender.com/products/getOriginalPrice',
    // getProductPrice:'https://tradevogue-backend.onrender.com/admin/getProductPrice',

    // product reviews
    addOrUpdateReview: 'https://tradevogue-backend.onrender.com/reviews/addOrUpdate',
    deleteReview: 'https://tradevogue-backend.onrender.com/reviews/delete',

    // CART
    fetchCart: 'https://tradevogue-backend.onrender.com/cart/fetch',
    addItemsToCart: 'https://tradevogue-backend.onrender.com/cart/add',
    removeItemFromCart: 'https://tradevogue-backend.onrender.com/cart/remove',
    updateItemFromCart: 'https://tradevogue-backend.onrender.com/cart/update',
    clearCart: 'https://tradevogue-backend.onrender.com/cart/clear',

    // OFFER
    createOffer: 'https://tradevogue-backend.onrender.com/offer/create',
    getOffers: 'https://tradevogue-backend.onrender.com/offer/get',
    deleteOffer: 'https://tradevogue-backend.onrender.com/offer/delete',
    updateOffer: 'https://tradevogue-backend.onrender.com/offer/update',
    updateOfferStatus:'https://tradevogue-backend.onrender.com/offer/statusUpdate',
    searchOffer:'https://tradevogue-backend.onrender.com/offer/search',
    // createOffer:'https://tradevogue-backend.onrender.com/offer/create',
    // getOffers:'https://tradevogue-backend.onrender.com/offer/get',
    // deleteOffer:'https://tradevogue-backend.onrender.com/offer/delete',
    // updateOffer:'https://tradevogue-backend.onrender.com/offer/update',
    // getCoupons:'https://tradevogue-backend.onrender.com/offer/getCoupons',

    // FAQs User Routes
    getFaqData: 'https://tradevogue-backend.onrender.com/getpaginatedData/faq',

    // FAQS Admin Routes
    updateFaqData: 'https://tradevogue-backend.onrender.com/faqs/update',
    deleteFaqData: 'https://tradevogue-backend.onrender.com/faqs/delete',
    addFaqData: 'https://tradevogue-backend.onrender.com/faqs/add',

    // pagination common
    getPaginatedData: 'https://tradevogue-backend.onrender.com/getPaginatedData',
    
    //wishlists
    showWishlist: 'https://tradevogue-backend.onrender.com/wishlist/showWishlist',
    addNewWishlist: 'https://tradevogue-backend.onrender.com/wishlist/addWishlist',
    addToWishlist: 'https://tradevogue-backend.onrender.com/wishlist/addToWishlist',
    showWishlistCount: 'https://tradevogue-backend.onrender.com/wishlist/showWishlistCount',
    showProducts: 'https://tradevogue-backend.onrender.com/wishlist/showWishlistProducts',
    deleteFromWishlist: 'https://tradevogue-backend.onrender.com/wishlist/deleteFromWishlist',
    removeWishlist : 'https://tradevogue-backend.onrender.com/wishlist/deleteWishlist',

    // ORDERS
    verifyOrderSummary: 'https://tradevogue-backend.onrender.com/orders/verifyOrderSummary',
    createOrder: 'https://tradevogue-backend.onrender.com/orders/create',
    getParticularUserOrders: 'https://tradevogue-backend.onrender.com/orders/getparticularUserOrders',
    cancelOrder: 'https://tradevogue-backend.onrender.com/orders/cancelOrder',

    // support, ticket 
    getTicketStatus: 'https://tradevogue-backend.onrender.com/ticket/get',
    webPushTokenDetail: 'https://tradevogue-backend.onrender.com/ticket/tokenDetails',
    saveTicket: 'https://tradevogue-backend.onrender.com/ticket/send',
    updateTitle: 'https://tradevogue-backend.onrender.com/ticket/updateTitle',
    addTicketTitle: 'https://tradevogue-backend.onrender.com/ticket/addTitle',
    deleteTitle: 'https://tradevogue-backend.onrender.com/ticket/deleteTitle',
    getAllTicket: 'https://tradevogue-backend.onrender.com/ticket/getall',
    updateTicket: 'https://tradevogue-backend.onrender.com/ticket/updateTicket',
    deleteTicket: 'https://tradevogue-backend.onrender.com/ticket/deleteTicket',
    ticketMail: 'https://tradevogue-backend.onrender.com/ticketStatus',


    // notifications
    getFcmToken: 'https://tradevogue-backend.onrender.com/notification/getfcmToken',
    getNotification: 'https://tradevogue-backend.onrender.com/notification/get',
    setNotifications: 'https://tradevogue-backend.onrender.com/notification/set',
    updateNotification: 'https://tradevogue-backend.onrender.com/notification/update',
    toggleNotification: 'https://tradevogue-backend.onrender.com/notification/toggle',
    comingNotification: 'https://tradevogue-backend.onrender.com/notification/coming',

    // ------ custom-UI ------

    // Home-Layout
    getHomeLayout: 'https://tradevogue-backend.onrender.com/homeLayout/get',
    getAllHomeLayouts: 'https://tradevogue-backend.onrender.com/homeLayout/getAll',
    createOrUpdateHomeLayout: 'https://tradevogue-backend.onrender.com/homeLayout/updateOrCreate',
    deleteHomeLayout: 'https://tradevogue-backend.onrender.com/homeLayout/delete',
    
    // Socials
    setSocials: 'https://tradevogue-backend.onrender.com/socials/set',
    getSocials: 'https://tradevogue-backend.onrender.com/socials/get',

    //banner
    setBanners : 'https://tradevogue-backend.onrender.com/banners/setBanners',
    getBanners : 'https://tradevogue-backend.onrender.com/banners/getBanners',
    deleteBanner : 'https://tradevogue-backend.onrender.com/banners/deleteBanner',
    updateBanner : 'https://tradevogue-backend.onrender.com/banners/updateBanner',
    toggleBanner : 'https://tradevogue-backend.onrender.com/banners/toggleBanner',

    // deals
    setDeals:'https://tradevogue-backend.onrender.com/deals/set',
    getDealsDetails:'https://tradevogue-backend.onrender.com/deals/getDetails',

    // about
    setAboutDetails:'https://tradevogue-backend.onrender.com/about/setDetails',
    getAboutDetails:'https://tradevogue-backend.onrender.com/about/getDetails',
    // sale 
    setSales: 'https://tradevogue-backend.onrender.com/sales/setSales',
    getSales: 'https://tradevogue-backend.onrender.com/sales/getSales',
    toggleSales: 'https://tradevogue-backend.onrender.com/sales/toggle',
    updateSales: 'https://tradevogue-backend.onrender.com/sales/update',
    deleteSales: 'https://tradevogue-backend.onrender.com/sales/delete',

    // payment keys 
    addPaymentKeys: 'https://tradevogue-backend.onrender.com/paymentKeys/add',
    updatePaymentKeys: 'https://tradevogue-backend.onrender.com/paymentKeys/update',
    deletePaymentKeys: 'https://tradevogue-backend.onrender.com/paymentKeys/delete',
    getPaymentKeys: 'https://tradevogue-backend.onrender.com/paymentKeys/get',

    // razorpay
    razorpayPayment: 'https://tradevogue-backend.onrender.com/razorpay/createUpiPayment',

    // update the order status 
    updateOrderStatus: 'https://tradevogue-backend.onrender.com/orders/updateOrderStatus',
    getLatestProductForBuyer: 'https://tradevogue-backend.onrender.com/orders/latestOrder'
  }
}

