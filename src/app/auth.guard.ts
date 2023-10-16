import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';

export const authGuard: CanActivateFn = async (route, state) => {
  // return true;
  const currentRoutes = state.url.split('/')[1];
  // return true;
  console.log("CURRENT ROUTE IS ",currentRoutes," route is ",state.url.split('/')[1]);
  const service = inject(CookieService);
  const router = inject(Router);

  if (currentRoutes == 'auth' && service.get('userToken')) {
    
    router.navigate(['/']);
    return false;
  }

  if (currentRoutes == 'dashboard') {

    try {
      const FetchService = inject(FetchDataService);
      const BackendUrl = inject(UtilsModule);
      const user: any = await FetchService.httpGet(BackendUrl.URLs.authorizeUrl);
      
      return true;

    } catch (error) {
      
      console.log("error is ", error);

      router.navigate(['/']);
      return false;

    }

  }
  return true;
};
