import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FetchDataService } from './shared/services/fetch-data.service';
import { UtilsModule } from './utils/utils.module';
import { LoginCheckService } from './shared/services/login-check.service';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const currentRoutes = state.url.split('/')[1];
  const router = inject(Router);
  const FetchService = inject(FetchDataService);
  const loginCheckService = inject(LoginCheckService);
  const BackendUrl = inject(UtilsModule);

  let navigateCheck = true;

  try{
    const data=await lastValueFrom((FetchService.HTTPGET(BackendUrl.URLs.authorizeUrl)));

    if (data != 'admin') {
      loginCheckService.getUser().subscribe((check: any) => {
        if (!check && currentRoutes == 'usersetting') navigateCheck = false;
        if (currentRoutes == 'auth' && check) navigateCheck = false;
        if (currentRoutes == 'dashboard') navigateCheck = false;
      });
    }
    else {
      loginCheckService.getUser().subscribe((check: any) => {
        if (currentRoutes == 'usersetting') navigateCheck = false;
        if (currentRoutes == 'auth' && check) navigateCheck = false;
        if (currentRoutes == 'billing') navigateCheck = false;
      });
    }
  }
  catch(error){
      if(currentRoutes=='auth') navigateCheck=true;
     else navigateCheck=false;
    }
  
  
  if (!navigateCheck) {
    router.navigate(['/']);
  }
  
  return navigateCheck;
};
