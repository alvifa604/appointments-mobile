/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Role } from 'src/app/shared/models/Role';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private error = new BehaviorSubject<string>(undefined);
  private roles = new BehaviorSubject<Role[]>(undefined);

  public error$ = this.error.asObservable();
  public roles$ = this.roles.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getRoles() {
    return this.http
      .get<Role[]>(`${environment.apiURl}/roles`, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        tap((roles) => {
          this.error.next(undefined);
          this.roles.next(roles);
        }),
        catchError((error: HttpErrorResponse) => {
          this.roles.next(undefined);
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }
}
