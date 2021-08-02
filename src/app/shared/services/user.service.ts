/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User>(undefined);
  private isLogged = new BehaviorSubject<boolean>(false);

  public user$ = this.user.asObservable();
  public isLogged$ = this.isLogged.asObservable();

  constructor() {}

  public setUser(user: User): void {
    if (user) {
      this.user.next(user);
      this.isLogged.next(true);
    }

    console.log(this.isLogged.value);
  }

  //Obtiene el token del usuario, se usará para persistir el login
  public getToken() {
    return this.user.value.token;
  }

  public getIsLogged() {
    return this.isLogged.value;
  }

  public setIsLogged(isLogged: boolean) {
    return this.isLogged.next(isLogged);
  }
}
