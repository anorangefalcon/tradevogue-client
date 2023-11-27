import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DialogBoxService } from '../shared/services/dialog-box.service';
import { CheckoutService } from './checkout.service';

export const redirectGuard: CanActivateFn = async(route, state) => {
  const dialogBox = inject(DialogBoxService);
  const checkOutService=inject(CheckoutService);
  const router=inject(Router);
  let emittedBoolean: any = false;
  let DialogBoxTemplate = {
    title: 'Do you want to cancel the payment?',
    subtitle: '',
    type: 'confirmation',
    confirmationText: 'Yes',
    cancelText: 'No',
  };
  
  dialogBox.confirmationDialogBox(DialogBoxTemplate);
  
  function waitForDialogResponse() {
    return new Promise(resolve => {
      dialogBox.responseEmitter.subscribe((data: any) => {
        resolve(data);
      });
    });
  }
  emittedBoolean = await waitForDialogResponse();
  if(emittedBoolean){
    console.log('emittedbollena called redirect called----------->');
    
    checkOutService.StripePaymentEmitter(false);
    checkOutService.addressSelected=(null);
  // router.navigate(['/']);
  }
  dialogBox.responseEmitter.next(false);
  
  return emittedBoolean;
};