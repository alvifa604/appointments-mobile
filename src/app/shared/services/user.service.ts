/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/Profile';
import { Role } from '../models/Role';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User>(undefined);
  private isLogged = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string>(undefined);
  private othersProfile = new BehaviorSubject<Profile>(undefined);

  public user$ = this.user.asObservable();
  public isLogged$ = this.isLogged.asObservable();
  public error$ = this.error.asObservable();
  public othersProfile$ = this.othersProfile.asObservable();

  constructor(private http: HttpClient) {}

  public setUser(user: User): void {
    if (user) {
      this.user.next(user);
      this.isLogged.next(true);
    } else {
      this.user.next(undefined);
      this.isLogged.next(false);
    }
  }

  public getProfile(idDocument: string) {
    return this.http
      .get<Profile>(`${environment.apiURl}/users/${idDocument}`, {
        headers: { authorization: `Bearer ${this.user.value.token}` },
      })
      .pipe(
        tap((profile) => {
          this.error.next(undefined);
          this.othersProfile.next(profile);
        }),
        catchError((error: HttpErrorResponse) => {
          this.othersProfile.next(undefined);
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  public setProfile() {
    this.othersProfile.next(undefined);
  }

  public changeRole(idDocument: string, role: string) {
    return this.http
      .patch(
        `${environment.apiURl}/users/role`,
        { idDocument, role },
        {
          headers: { authorization: `Bearer ${this.user.value.token}` },
        }
      )
      .pipe(
        tap(() => {
          if (idDocument === this.user.value.idDocument) {
            this.user.value.role = role;
          } else {
            this.othersProfile.value.role = role;
          }
        }),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  public getProfileRole() {
    return this.othersProfile.value.role;
  }

  public getUserIdDocument() {
    return this.user.value.idDocument;
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
