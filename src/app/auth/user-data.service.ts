import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userDetailsUrl = '../../assets/tempDB/userDetails.json';

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.userDetailsUrl);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.getData().pipe(
      map((data: any[]) => {
        const user = data.find((user: any) => user.username === username && user.password === password);
        return !!user;
      })
    );
  }

appendUser(user: any): Observable<any> {
  return this.getData().pipe(
    map((data: any[]) => {
      const userToAdd = {
        username: user.username,
        email: user.email,
        password: user.password
      };
      console.log("User to add: ", userToAdd);
      data.push(userToAdd);
      return data;
    }),
    switchMap((updatedData: any[]) => {
      console.log("Sending PUT request with updated data: ", updatedData);
      return this.http.put(this.userDetailsUrl, updatedData);
    })
  )
}


}
