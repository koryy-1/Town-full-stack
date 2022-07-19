import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3333/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(),
        catchError(() => [])
      );
  }

  createUser(user: User) {
    return this.http.post<any>(`${this.usersUrl}/edit`, user)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }));
  }

  updateUser(id: string, user: User) {
    return this.http.put<any>(`${this.usersUrl}/edit/${id}`, user)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }));
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.usersUrl}/edit/${id}`)
    .pipe(map(user => {
      return user;
    }));
  }
}
