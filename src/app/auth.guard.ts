import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';
import { LoginCheckService } from './shared/services/login-check.service';
import { last, lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const currentRoutes = state.url.split('/')[1];
  const router = inject(Router);
  const cookie=inject(CookieService);
  const FetchService = inject(FetchDataService);
  const loginCheckService = inject(LoginCheckService);
  const BackendUrl = inject(UtilsModule);

  let navigateCheck = true;
  // console.log('check comeup is ',typeof(loginCheckService.getUser()));
  //  let check= await lastValueFrom(loginCheckService.getUser());
  let check=cookie.get('userToken');
    if(check){
      const data=await lastValueFrom((FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl)));
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
    
  if (!navigateCheck) {
    router.navigate(['/']);
  }
  
  return navigateCheck;
};
  // const currentRoutes = state.url.split('/')[1];
  // const router = inject(Router);
  // const FetchService = inject(FetchDataService);
  // const BackendUrl = inject(UtilsModule);
  // if(currentRoutes=='usersetting'){
  //   try {
  //     let data=await lastValueFrom(FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl));
  //  if(data=='admin'){
  //   router.navigate(['/']);
  //   return false;
  //  }
  //  return true;
  //   } catch (error) {
  //     router.navigate(['/']);
  //     return false;
  //   }
   
  // }

  // if (currentRoutes == 'dashboard') {
  //   try {
  //     let data =await lastValueFrom(FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl));
  //     if(data=='admin') return true;
  //     else {
  //       router.navigate(['/']);
  //       return false;
  //     }
  //   } catch (error) {
  //     router.navigate(['/'])
  //       return false;
  //   }

  // }

 
