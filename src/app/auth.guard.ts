import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';
import { LoginCheckService } from './shared/services/login-check.service';
import { lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from './shared/services/toast.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const currentRoutes = state.url.split('/')[1];
  const router = inject(Router);
  const cookie=inject(CookieService);
  const FetchService = inject(FetchDataService);
  const loginCheckService = inject(LoginCheckService);
  const toastService=inject(ToastService);
  const BackendUrl = inject(UtilsModule);
  let navigateCheck = true;
  let check=cookie.get('userToken');
  let data;
    if(check){
      data=await lastValueFrom((FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl)));
      if (data != 'admin') { 
          if (!check && currentRoutes == 'usersetting') navigateCheck = false;
          if (currentRoutes == 'auth' && check) navigateCheck = false;
          if (currentRoutes == 'dashboard'){ 
            navigateCheck = false;
          }
      }
      else {
          if (currentRoutes == 'auth' && check) navigateCheck = false;        
          if (state.url == '/cart/billing') navigateCheck = false;
      }
    }
    else{
      if(currentRoutes=='auth') navigateCheck=true;
      else navigateCheck=false;
    }
    

  if(data=='admin' && state.url == '/cart/billing'){
    toastService.errorToast({title:'Admin are not allowed to order'});
    router.navigate(['/dashboard']);
  }

  else if(!navigateCheck) {
    router.navigate(['/']);
  }
  
  return navigateCheck;
};