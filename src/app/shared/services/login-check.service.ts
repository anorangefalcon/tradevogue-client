import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, filter, map, pairwise } from 'rxjs';
import { ToastService } from './toast.service';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root'
})

export class LoginCheckService {

  private userSubject = new BehaviorSubject({});
  private user$ = this.userSubject.asObservable();
  previousUrl: any = '/';
  constructor(private cookieService: CookieService, private router: Router, private toastService: ToastService,private BackendUrl:UtilsModule, private FetchDataService:FetchDataService) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([prevEvent, currentEvent]: [NavigationEnd, NavigationEnd]) => {
        this.previousUrl = prevEvent.url; 
      });

    if (cookieService.get('userToken',)) {
      let userObj = {
        userToken : this.cookieService.get('userToken'),
        name: cookieService.get('name'),
        fcmToken: ''
      }
      this.userSubject.next({ 'user': userObj, 'loggedIn': true });

      if (Object.keys(this.userSubject.getValue()).length > 0) {
        return;
      }

      this.loginUser(userObj, false);
    }
    

  }

  loginUser(userObj: any, redirect: Boolean = true) {    
    this.cookieService.set('userToken', userObj.userToken, { path: '/' });
    this.cookieService.set('name', userObj.name, { path: '/' });
    this.userSubject.next({ 'user': userObj, 'loggedIn': true });

    if (this.cookieService.get('fcmToken')) {
      this.setFcmToken(this.cookieService.get('fcmToken'));
    }

    if (redirect) {
      if(this.previousUrl=='/cart' || this.previousUrl.includes('/explore') ){
       this.router.navigate([this.previousUrl]);
       return;
      }  


      this.FetchDataService.HTTPGET(this.BackendUrl.URLs.authorizeUrl).subscribe((data)=>{
        if(data=='admin'){
          this.router.navigate(['/dashboard']);
        }
        else{
          this.router.navigate(['/']);

        }
      })

    }
  }

  logoutUser(navigate: Boolean = true) {
    // this.cookieService.deleteAll();
    this.cookieService.delete('userToken', '/');
    this.cookieService.delete('name', '/');
    this.userSubject.next({ 'loggedIn': false })
    
    if(navigate){
      this.toastService.notificationToast({
        title: 'Logged Out Successfully'
      });
      ``
      this.router.navigate(['/']);
    } 
  }

  setFcmToken(currentToken: any) {
    // this.cookieService.set('fcmToken', currentToken);
    const obj: any = this.userSubject.getValue();
    obj.fcmToken = currentToken;

    this.userSubject.next(obj);
  }

  getUser(what: String = ''): Observable<any> {

    if ((what.toLowerCase()) == 'name') {
      return this.user$.pipe(
        map((data: any) => {
          return data.user?.name
        })
      );
    }
    else if ((what.toLowerCase()) == 'token') {
      return this.user$.pipe(
        map((data: any) => {
          return data.user?.userToken
        })
      );
    }
    // else if ((what.toLowerCase()) == 'fcm') {
    //   return this.user$.pipe(
    //     map((data: any) => {
    //       return data.fcmToken
    //     })
    //   );
    // }

    return this.user$.pipe(
      map((data: any) => {
        return data.loggedIn
      })
    );
  }

  updateDetails(details: any){
    let userObj = {
      userToken : this.cookieService.get('userToken'),
      name: details.name.firstname,
      fcmToken: this.cookieService.get('fcmToken') ? this.cookieService.get('fcmToken') : ''
    }

    this.userSubject.next({ 'user': userObj, 'loggedIn': true });
  }

}