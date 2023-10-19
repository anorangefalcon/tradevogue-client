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

    // Dashboard
    addproduct: 'http://localhost:1000/admin/addProduct',
    fetchProductInventory: 'http://localhost:1000/admin/fetchProducts',
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

    deleteAddress:'http://localhost:1000/user/deleteAddress',

    // FAQ
    getFaqData: 'http://localhost:1000/user/getFaq',
<<<<<<< Updated upstream
    // cart
    fetchCart: 'http://localhost:1000/cart/fetch',
    
    
    // COUPONS
    createCoupon:'http://localhost:1000/admin/createOffer',
    getOffers:'http://localhost:1000/admin/getOffers',
    getProductPrice:'http://localhost:1000/admin/getProductPrice',
    deleteOffer:'http://localhost:1000/admin/deleteOffer'
   
=======
    updateFaqData: 'http://localhost:1000/admin/updateFaq',
    deleteFaqData: 'http://localhost:1000/admin/deleteFaq',
>>>>>>> Stashed changes
  }

}

