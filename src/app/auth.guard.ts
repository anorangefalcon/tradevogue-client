import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';

export const authGuard: CanActivateFn = async (route, state) => {
  const currentRoutes=state.url.split('/')[1];
  const service=inject(CookieService);
  const router=inject(Router);

  if(currentRoutes=='auth' && service.get('userToken')){
    router.navigate(['/']);
    return false;
  }

  if(currentRoutes=='dashboard'){
    
    try {
      const FetchService=inject(FetchDataService);
    const BackendUrl=inject(UtilsModule);
    const data=await FetchService.httpPost(BackendUrl.URLs.AdminTestURL,{});
    console.log("data 0INSIDE GUARD IS ",data);
    return true;
    } catch (error) {
      console.log("error is ",error);
      router.navigate(['/']);
      return false;
      
    }
    
  }
  return true;
};
