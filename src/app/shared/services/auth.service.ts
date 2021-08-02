/* eslint-disable @typescript-eslint/member-ordering */
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Register } from '../models/Register';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private error = new BehaviorSubject<string>('');

  public token: string;
  public error$ = this.error.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private storage: Storage
  ) {}

  //Se encarga de hacer login a la api
  public login(login: Login): Observable<User> {
    return this.http
      .post<User>(`${environment.apiURl}/users/login`, login, {})
      .pipe(
        map((user) => {
          this.userService.setUser(user);
          this.token = user.token;
          this.saveToken(user.token);
          this.error.next(null);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  //Registra un usuario
  public register(register: Register): Observable<User> {
    return this.http
      .post<User>(`${environment.apiURl}/users/register`, register, {})
      .pipe(
        map((user) => {
          this.userService.setUser(user);
          console.log(user.name);
          this.saveToken(user.token);
          this.error.next(null);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  public async logOut() {
    await this.storage.remove(environment.tokenKey);
    this.router.navigate(['session']);
  }

  //Obtiene el usuario con el token que el usuario genera en el login
  //Persiste el login en caso de recarga de página
  async loadToken() {
    const token = await this.storage.get(environment.tokenKey);
    this.token = token;

    if (token) {
      console.log('token existe');
      this.userService.setIsLogged(true);
      this.router.navigate(['home']);
    } else {
      this.userService.setIsLogged(false);
    }
  }

  async setHeaders() {
    await this.loadToken();
  }

  async saveToken(token: string) {
    await this.storage.set(environment.tokenKey, token);
  }

  public getCurrentUser() {
    return this.http
      .get<User>(`${environment.apiURl}/users`, {
        headers: { authorization: `Bearer ${this.token}` },
      })
      .pipe(
        map((user) => {
          this.userService.setUser(user);
          console.log(user);
          this.saveToken(user.token);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }
}
