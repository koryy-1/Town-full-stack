import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | undefined>;
  public currentUser: Observable<User | undefined>;

  private authUrl = 'http://localhost:3333/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient
    ) {
    this.currentUserSubject = new BehaviorSubject<User | undefined>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | undefined {
    return this.currentUserSubject.value;
  }

  login(login: string, password: string) {
    return this.http.post<any>(`${this.authUrl}/login`, { login, password })
      .pipe(map(userToken => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(userToken));
        this.currentUserSubject.next(userToken);
        return userToken;
      }));
  }

  register(user: User) {
    return this.http.post<any>(`${this.authUrl}/register`, user)
      .pipe(map(userToken => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(userToken));
        this.currentUserSubject.next(userToken);
        return userToken;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined); // kakayato xernya
    this.router.navigate(['/users/login']);
  }
}
