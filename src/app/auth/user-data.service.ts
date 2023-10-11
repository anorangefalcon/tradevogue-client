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
}
