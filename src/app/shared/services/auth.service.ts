/* eslint-disable curly */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Login } from '../models/Login';
import { User } from '../models/User';
import { Register } from '../models/Register';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Token } from '../models/Token';
import { UtilitiesServicesService } from './utilities-services.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private error = new BehaviorSubject<string>('');

  public token: string;
  public decodedToken: Token;
  public error$ = this.error.asObservable();

  constructor(
    private utilitiesService: UtilitiesServicesService,
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
    this.userService.setUser(undefined);
    await this.storage.remove(environment.tokenKey);
    this.router.navigate(['session']);
  }

  //Obtiene el usuario con el token que el usuario genera en el login
  //Persiste el login en caso de recarga de página
  async loadToken(): Promise<void> {
    const token = await this.storage.get(environment.tokenKey);
    this.token = token;
    const decodedToken: Token = this.parseJwt(this.token);

    if (decodedToken === undefined || decodedToken === null) return;

    if (decodedToken.exp > Date.now() / 1000) {
      this.userService.setIsLogged(true);
      this.router.navigate(['home']);
    } else {
      this.utilitiesService.presentOkAlert(
        'Advertencia',
        'La sesión ha expirado, inicie sesión.'
      );
      this.userService.setIsLogged(false);
    }
  }

  async saveToken(token: string) {
    this.token = token;
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
          this.saveToken(user.token);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  private parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
}
