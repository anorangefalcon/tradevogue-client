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
    forgetPasswordUrl : 'http://localhost:1000/user/forget',
    updatePasswordUrl : 'http://localhost:1000/user/update',
    getDetails:'http://localhost:1000/user/getDetails',
    updateDetails:'http://localhost:1000/user/updateDetails',
    authorizeUrl:'http://localhost:1000/checkUser',
    changePassword : 'http://localhost:1000/user/changePassword',
    // signupUrl:'http://localhost:5000/user/signup',
    getAddress:'http://localhost:1000/user/getAddress',
    addAddress:'http://localhost:1000/user/addAddress',
    subscribeMail : 'http://localhost:1000/sendMail',
    updateAddress:'http://localhost:1000/user/updateAdress',
    deleteAddress:'http://localhost:1000/user/deleteAddress',

    // Dashboard
    addproduct: 'http://localhost:1000/admin/addProduct',
    fetchProductInventory: 'http://localhost:1000/admin/fetchProducts',
    updateproduct: 'http://localhost:1000/admin/updateProduct',
    deleteproducts: 'http://localhost:1000/admin/deleteProducts',
    fetchFeatures: 'http://localhost:1000/admin/fetchProductFeatures',
    updateFeatures: 'http://localhost:1000/admin/updateProductFeature',
    updateAccount: 'http://localhost:1000/admin/updateDetails',
    getAccount: 'http://localhost:1000/admin/getadminDetails',

    // stripe
    stripePayment: 'http://localhost:1000/user/create-payment-intent',

    // products
    fetchProducts: 'http://localhost:1000/products/fetch',
    fetchProductUrl: 'http://localhost:1000/products/fetchProduct',
    uniqueProductFields: 'http://localhost:1000/products/uniqueFields',
    getOriginalProductPrice:'http://localhost:1000/products/getOriginalPrice',

   // product reviews
   addOrUpdateReview: 'http://localhost:1000/reviews/addOrUpdate',
   deleteReview: 'http://localhost:1000/reviews/delete',   

    // FAQ
    getFaqData: 'http://localhost:1000/user/getFaq',

    // CART
    fetchCart: 'http://localhost:1000/cart/fetch',
    addItemsToCart: 'http://localhost:1000/cart/add',
    removeItemFromCart: 'http://localhost:1000/cart/remove',
    updateItemFromCart: 'http://localhost:1000/cart/update',
    clearCart: 'http://localhost:1000/cart/clear',

    // COUPONS
    createCoupon:'http://localhost:1000/admin/createOffer',
    getOffers:'http://localhost:1000/admin/getOffers',
    getProductPrice:'http://localhost:1000/admin/getProductPrice',
    deleteOffer:'http://localhost:1000/admin/deleteOffer',
    updateOffer:'http://localhost:1000/admin/updateOffer',
   
    // FAQS
    updateFaqData: 'http://localhost:1000/admin/updateFaq',
    deleteFaqData: 'http://localhost:1000/admin/deleteFaq',
    addFaqData: 'http://localhost:1000/admin/addFaq',

    // pagination common
    getPaginatedData: 'http://localhost:1000/user/getPaginatedData',
    //wishlists
    showWishlist : 'http://localhost:1000/wishlist/showWishlist',

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
  }
}

