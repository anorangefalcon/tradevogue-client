import { NgModule,isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
@NgModule({
  imports: [
    CommonModule
  ]
})

export class UtilsModule {

  BackendUrl:String=environment.BackendURL;
  pincodeUrl:String=environment.Pincode;
  URLs: any = {
    signupUrl: `${this.BackendUrl}/user/signup`,
    loginUrl: `${this.BackendUrl}/user/login`,
    subscribeMail: `${this.BackendUrl}/user/subscribe`,
    forgetPasswordUrl: `${this.BackendUrl}/user/forget`,
    updatePasswordUrl: `${this.BackendUrl}/user/update`,
    getDetails: `${this.BackendUrl}/user/getDetails`,
    updateDetails: `${this.BackendUrl}/user/updateDetails`,
    authorizeUrl: `${this.BackendUrl}/checkUser`,
    changePassword: `${this.BackendUrl}/user/changePassword`,
    // signupUrl:`http://localhost:5000/user/signup`,
    getAddress: `${this.BackendUrl}/user/getAddress`,
    addAddress: `${this.BackendUrl}/user/addAddress`,
    updateAddress: `${this.BackendUrl}/user/updateAdress`,
    deleteAddress: `${this.BackendUrl}/user/deleteAddress`,
    setDefaultAddress: `${this.BackendUrl}/user/setDefault`,
    getCoupons: `${this.BackendUrl}/offer/getCoupons`,
    // getAddress:`${this.BackendUrl}/user/getAddress`,
    // addAddress:`${this.BackendUrl}/user/addAddress`,
    // subscribeMail : `${this.BackendUrl}/sendMail`,
    // updateAddress:`${this.BackendUrl}/user/updateAdress`,
    // deleteAddress:`${this.BackendUrl}/user/deleteAddress`,
    // setDefaultAddress:`${this.BackendUrl}/user/setDefault`,
   

  // Dashboard
  
    fetchSellerNotfications: `${this.BackendUrl}/admin/fetchSellerNotfications`,

    // Statistics
    fetchOverallData: `${this.BackendUrl}/admin/getOverallInfo`,
    fetchSalesStats: `${this.BackendUrl}/admin/fetchSalesData`,
    fetchCategoryStats: `${this.BackendUrl}/admin/fetchCategoryData`,
    fetchReviewStats: `${this.BackendUrl}/admin/fetchReviewData`,
    fetchPopularProducts: `${this.BackendUrl}/admin/fetchPopularProducts`,

    addproduct: `${this.BackendUrl}/admin/addProduct`,
    fetchProductInventory: `${this.BackendUrl}/admin/fetchProducts`,
    fetchProductDetails: `${this.BackendUrl}/admin/fetchProductDetails`,
    updateproduct: `${this.BackendUrl}/admin/updateProduct`,
    productStatus: `${this.BackendUrl}/admin/updateProductStatus`,
    deleteproducts: `${this.BackendUrl}/admin/deleteProducts`,
    fetchFeatures: `${this.BackendUrl}/admin/fetchProductFeatures`,
    updateFeatures: `${this.BackendUrl}/admin/updateProductFeature`,
    updateAccount: `${this.BackendUrl}/admin/updateDetails`,
    getAccount: `${this.BackendUrl}/admin/getadminDetails`,
    getSellerOrders: `${this.BackendUrl}/orders/sellerOrders`,
    getSellerOrderDetails: `${this.BackendUrl}/orders/sellerOrderDetail`,
    getOrderOverallData: `${this.BackendUrl}/orders/getOrderOverallData`,
    getLatestOrderId: `${this.BackendUrl}/orders/getLatestOrderId`,

    // stripe
    stripePayment: `${this.BackendUrl}/user/create-payment-intent`,

    // products
    fetchProducts: `${this.BackendUrl}/products/fetch`,
    fetchProductUrl: `${this.BackendUrl}/products/fetchProduct`,
    uniqueProductFields: `${this.BackendUrl}/products/uniqueFields`,
    getOriginalProductPrice: `${this.BackendUrl}/products/getOriginalPrice`,
    // getProductPrice:`${this.BackendUrl}/admin/getProductPrice`,

    // product reviews
    addOrUpdateReview: `${this.BackendUrl}/reviews/addOrUpdate`,
    deleteReview: `${this.BackendUrl}/reviews/delete`,

    // CART
    fetchCart: `${this.BackendUrl}/cart/fetch`,
    addItemsToCart: `${this.BackendUrl}/cart/add`,
    removeItemFromCart: `${this.BackendUrl}/cart/remove`,
    updateItemFromCart: `${this.BackendUrl}/cart/update`,
    clearCart: `${this.BackendUrl}/cart/clear`,
    removeItems: `${this.BackendUrl}/cart/removeItems`,

    // OFFER
    createOffer: `${this.BackendUrl}/offer/create`,
    getOffers: `${this.BackendUrl}/offer/get`,
    deleteOffer: `${this.BackendUrl}/offer/delete`,
    updateOffer: `${this.BackendUrl}/offer/update`,
    updateOfferStatus:`${this.BackendUrl}/offer/statusUpdate`,
    searchOffer:`${this.BackendUrl}/offer/search`,
    // createOffer:`${this.BackendUrl}/offer/create`,
    // getOffers:`${this.BackendUrl}/offer/get`,
    // deleteOffer:`${this.BackendUrl}/offer/delete`,
    // updateOffer:`${this.BackendUrl}/offer/update`,
    // getCoupons:`${this.BackendUrl}/offer/getCoupons`,

    // FAQs User Routes
    // getFaqData: `${this.BackendUrl}/getpaginatedData`,

    // FAQS Admin Routes
    updateFaqData: `${this.BackendUrl}/faqs/update`,
    deleteFaqData: `${this.BackendUrl}/faqs/delete`,
    addFaqData: `${this.BackendUrl}/faqs/add`,
    getFaqData: `${this.BackendUrl}/faqs/get`,
    
    //wishlists
    showWishlist: `${this.BackendUrl}/wishlist/showWishlist`,
    addNewWishlist: `${this.BackendUrl}/wishlist/addWishlist`,
    addToWishlist: `${this.BackendUrl}/wishlist/addToWishlist`,
    // showWishlistCount: `${this.BackendUrl}/wishlist/showWishlistCount`,
    showProducts: `${this.BackendUrl}/wishlist/showWishlistProducts`,
    deleteFromWishlist: `${this.BackendUrl}/wishlist/deleteFromWishlist`,
    removeWishlist : `${this.BackendUrl}/wishlist/deleteWishlist`,
    editWishlist : `${this.BackendUrl}/wishlist/editWishlist`,

    // ORDERS
    verifyOrderSummary: `${this.BackendUrl}/orders/verifyOrder`,
    createOrder: `${this.BackendUrl}/orders/create`,
    getParticularUserOrders: `${this.BackendUrl}/orders/getparticularUserOrders`,
    getIndividualOrders: `${this.BackendUrl}/orders/getIndividualOrders`,
    cancelOrderedProduct: `${this.BackendUrl}/orders/cancelOrderProduct`,
    cancelOrder:`${this.BackendUrl}/orders/cancelOrder`,
    verifyOrderWithoutCoupon:`${this.BackendUrl}/orders/verifyOrderWithoutCoupon`,

    // support, ticket 
    getTicketStatus: `${this.BackendUrl}/ticket/get`,
    webPushTokenDetail: `${this.BackendUrl}/ticket/tokenDetails`,
    saveTicket: `${this.BackendUrl}/ticket/send`,
    updateTitle: `${this.BackendUrl}/ticket/updateTitle`,
    addTicketTitle: `${this.BackendUrl}/ticket/addTitle`,
    deleteTitle: `${this.BackendUrl}/ticket/deleteTitle`,
    getAllTicket: `${this.BackendUrl}/ticket/getall`,
    
    // getAllTicket: `${this.BackendUrl}/ticket/combinedticketSearch`,
    
    
    updateTicket: `${this.BackendUrl}/ticket/updateTicket`,
    deleteTicket: `${this.BackendUrl}/ticket/deleteTicket`,
    ticketMail: `${this.BackendUrl}/ticketStatus`,


    // notifications
    getFcmToken: `${this.BackendUrl}/notification/getfcmToken`,
    getNotification: `${this.BackendUrl}/notification/get`,
    setNotifications: `${this.BackendUrl}/notification/set`,
    updateNotification: `${this.BackendUrl}/notification/update`,
    toggleNotification: `${this.BackendUrl}/notification/toggle`,
    comingNotification: `${this.BackendUrl}/notification/coming`,
    sendNotification: `${this.BackendUrl}/notification/send`,
    deleteNotification: `${this.BackendUrl}/notification/delete`,

    // breadCrumbs
    getBreadCrumbs: `${this.BackendUrl}/breadcrumbs/get`,
    setBreadCrumbs: `${this.BackendUrl}/breadcrumbs/set`,

    // ------ custom-UI ------

    // Home-Layout
    getHomeLayout: `${this.BackendUrl}/homeLayout/get`,
    getAllHomeLayouts: `${this.BackendUrl}/homeLayout/getAll`,
    createOrUpdateHomeLayout: `${this.BackendUrl}/homeLayout/updateOrCreate`,
    deleteHomeLayout: `${this.BackendUrl}/homeLayout/delete`,
    
    // Socials
    setSocials: `${this.BackendUrl}/socials/set`,
    getSocials: `${this.BackendUrl}/socials/get`,
    getInstagram: `${this.BackendUrl}/socials/getInstagram`,

    //banner
    setBanners : `${this.BackendUrl}/banners/setBanners`,
    getBanners : `${this.BackendUrl}/banners/getBanners`,
    deleteBanner : `${this.BackendUrl}/banners/deleteBanner`,
    updateBanner : `${this.BackendUrl}/banners/updateBanner`,
    toggleBanner : `${this.BackendUrl}/banners/toggleBanner`,

    // deals
    setDeals:`${this.BackendUrl}/deals/set`,
    getDealsDetails:`${this.BackendUrl}/deals/getDetails`,

    // about
    setAboutDetails:`${this.BackendUrl}/about/setDetails`,
    getAboutDetails:`${this.BackendUrl}/about/getDetails`,
    getOverAllDetails: `${this.BackendUrl}/about/getOverAllDetails`,

    // sale 
    setSales: `${this.BackendUrl}/sales/setSales`,
    getSales: `${this.BackendUrl}/sales/getSales`,
    toggleSales: `${this.BackendUrl}/sales/toggle`,
    updateSales: `${this.BackendUrl}/sales/update`,
    deleteSales: `${this.BackendUrl}/sales/delete`,

    // payment keys 
    addPaymentKeys: `${this.BackendUrl}/paymentKeys/add`,
    updatePaymentKeys: `${this.BackendUrl}/paymentKeys/update`,
    deletePaymentKeys: `${this.BackendUrl}/paymentKeys/delete`,
    getPaymentKeys: `${this.BackendUrl}/paymentKeys/get`,
    getDecrptedPaymentKeys: `${this.BackendUrl}/paymentKeys/decrypt`,

    // razorpay
    createRazorpayOrder: `${this.BackendUrl}/razorpay/createUpiPayment`,

    // redis 
    getClientSecret: `${this.BackendUrl}/paymentKeys/get-redis-data`,

    // update the order status 
    updateOrderStatus: `${this.BackendUrl}/orders/updateOrderStatus`,
    // getLatestProductForBuyer: `${this.BackendUrl}/orders/latestOrder`,

    // T&C
    getTandC:`${this.BackendUrl}/tc/get`,
    setTandC: `${this.BackendUrl}/tc/set`,

    // pincode
    getPincode: `${this.pincodeUrl}/api/purchaser/getDetailsByPostalCode`,

    // webhook
    webhook: `${this.BackendUrl}/webhook`,

    // payment intent
    createPaymentIntent: `${this.BackendUrl}/create-payment-intent`,

    // invoice send 
    sendInvoice: `${this.BackendUrl}/invoiceSend`, 
    
    // chat
    getChatDetails: `${this.BackendUrl}/chat/allOnlineUsers`,
  }
}

