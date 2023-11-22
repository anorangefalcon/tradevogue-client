import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const currentRoutes = state.url.split('/')[1];
  const router = inject(Router);
  const FetchService = inject(FetchDataService);
  const BackendUrl = inject(UtilsModule);
  if(currentRoutes=='usersetting'){
    try {
      let data=await lastValueFrom(FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl));
   if(data=='admin'){
    router.navigate(['/']);
    return false;
   }
   return true;
    } catch (error) {
      router.navigate(['/']);
      return false;
    }
   
  }


  if (currentRoutes == 'dashboard') {
    try {
      let data =await lastValueFrom(FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl));
      if(data=='admin') return true;
      else {
        router.navigate(['/']);
        return false;
      }
    } catch (error) {
      router.navigate(['/'])
        return false;
    }

  }

  return true;
};
