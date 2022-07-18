import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../models/user-model';

// const users: User[] = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

const users: User[] = JSON.parse(localStorage.getItem('Users') as string)

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(delay(500))
        .pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/users/login') && method === 'POST':
                return authenticate();
            case url.endsWith('/users/register') && method === 'POST':
                return register();
                case url.endsWith('/users/увше') && method === 'POST':
                return register();
            // case url.endsWith('/users') && method === 'GET':
            //     return getUsers();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }    
    }

    // route functions

    function authenticate() {
        const { login, password } = body;
        let user = users.find(x => x.login === login && x.password === password);
        if (!user) return error('Login or password is incorrect');

        return ok({
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            role: user.role,
            token: 'fake-jwt-token' // authorize
        })
    }

    function getUsers() {
        if (!isLoggedIn()) return unauthorized();
        return ok(users);
    }

    function register() {
        let user: User = body;
        
        const result = users.find(x => x.login === user.login);
        if (result) return error('Login are already exist');

        if (users?.length != 0 && users[users.length - 1].hasOwnProperty('id'))
            user.id = users[users.length - 1].id + 1
        else
            user.id = 0

        users.push(user)
        localStorage.setItem('Users', JSON.stringify(users))

        return ok({
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            role: user.role,
            token: 'fake-jwt-token'
        })
    }

    // helper functions

    function ok(body?: any) {
        return of(new HttpResponse({ status: 200, body }))
    }

    function error(message?: string | undefined) {
        return throwError(() => new Error(message));
    }

    function unauthorized() {
        return throwError(() => new Error("{ status: 401, error: 'Unauthorised' }"));
    }

    function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}