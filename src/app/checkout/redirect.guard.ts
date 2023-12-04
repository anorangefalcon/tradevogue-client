import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { DialogBoxService } from '../shared/services/dialog-box.service';
import { CheckoutService } from './checkout.service';
import { Subscription } from 'rxjs';

export const redirectGuard: CanActivateFn = async(route, state) => {
  const dialogBox = inject(DialogBoxService);
  const checkOutService=inject(CheckoutService);
  let emittedBoolean: any = false;
  let DialogBoxTemplate = {
    title: 'Are you want to cancel the Transaction?',
    subtitle: '',
    type: 'confirmation',
    confirmationText: 'Yes',
    cancelText: 'No',
  };

  let dataSubscription = new Subscription;
  dialogBox.confirmationDialogBox(DialogBoxTemplate);
  
  function waitForDialogResponse() {
    return new Promise(resolve => {
      dataSubscription = dialogBox.responseEmitter.subscribe((data: any) => {
        if(data) {
          console.log("data cleared of address", data);
          resolve(data);
        }
      });
    });
  }
  emittedBoolean = await waitForDialogResponse();
  if(emittedBoolean){
    console.log("emitted boolean", emittedBoolean);
    checkOutService.addressSelected = null;
    checkOutService.secureNavbar.next(false);
    checkOutService.loadStripe.next(false);
    checkOutService.unloadStripeScript();
  }
  checkOutService.addressSelected = null || emittedBoolean;
  dialogBox.responseEmitter.next(false);
  
  dataSubscription.unsubscribe();
  return emittedBoolean;
};