import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  console.log("HEllo");
  return true;
  const currentRoutes = state.url.split('/')[1];
  // const service = inject(userService);
  const router = inject(Router);

  // let userLogin=await lastValueFrom(service.SubscrbingUserSubject());
  // if (currentRoutes == 'auth' && userLogin) {
  //   router.navigate(['/']);
  //   return false;
  // }

  if (currentRoutes == 'dashboard') {
      const FetchService = inject(FetchDataService);
      const BackendUrl = inject(UtilsModule);
      let a =await lastValueFrom(FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl));
      if(a) return true;
      else {
        router.navigate(['/']);
        return false;
      }
  }

  return true;
};
