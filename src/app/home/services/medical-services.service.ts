/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Service } from '../models/Service';

@Injectable({
  providedIn: 'root',
})
export class MedicalServicesService {
  private error = new BehaviorSubject<string>(undefined);
  private services = new BehaviorSubject<Service[]>(undefined);

  public error$ = this.error.asObservable();
  public services$ = this.services.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getServices() {
    return this.http
      .get<Service[]>(`${environment.apiURl}/services`, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        map((services) => {
          this.services.next(services);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }
}
