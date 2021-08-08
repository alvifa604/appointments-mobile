/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Service } from '../models/Service';

@Injectable({
  providedIn: 'root',
})
export class MedicalServicesService {
  private error = new BehaviorSubject<string>(undefined);
  private services = new BehaviorSubject<Service[]>([]);

  public error$ = this.error.asObservable();
  public services$ = this.services.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  public createService(name: string) {
    return this.http
      .post<Service>(
        `${environment.apiURl}/services`,
        { name },
        {
          headers: { authorization: `Bearer ${this.authService.token}` },
        }
      )
      .pipe(
        tap((newService) => {
          this.services.value.push(newService);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

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

  public deleteService(id: number) {
    return this.http
      .delete(`${environment.apiURl}/services/${id}`, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        tap(() => {
          if (this.services.value.length === 1) {
            this.services.next([]);
          } else {
            const services: Service[] = this.services.value.filter(
              (s) => s.id !== id
            );
            this.services.next(services);
          }
        }),
        catchError((error) => throwError(error))
      );
  }

  resetError() {
    this.error.next(undefined);
  }
}
