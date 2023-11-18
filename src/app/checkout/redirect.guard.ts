import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { DialogBoxService } from '../shared/services/dialog-box.service';

export const redirectGuard: CanActivateFn = async(route, state) => {
  const dialogBox = inject(DialogBoxService);
  
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
  dialogBox.responseEmitter.next(false);
  
  return emittedBoolean;
};