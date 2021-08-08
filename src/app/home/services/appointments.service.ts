/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Appointment } from 'src/app/home/models/Appointment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { AppointmentCreate } from '../models/AppointmentCreate';
import { AppointmentEdit } from '../models/AppointmentEdit';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private appointments = new BehaviorSubject<Appointment[]>(undefined);
  private error = new BehaviorSubject<string>(undefined);

  public appointments$ = this.appointments.asObservable();
  public error$ = this.error.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAppointments() {
    return this.http
      .get<Appointment[]>(`${environment.apiURl}/appointments`, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        map((appointments) => {
          appointments.forEach((app) => {
            app.date = new Date(app.date + 'Z');
          });
          this.appointments.next(appointments);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  public createAppoinment(newAppointment: AppointmentCreate) {
    return this.http
      .post<Appointment>(`${environment.apiURl}/appointments`, newAppointment, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        tap((newA) => {
          newA.date = new Date(newA.date);
          this.appointments.next([...this.appointments.getValue(), newA]);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  public updateAppointment(
    appointmentId: number,
    canceled: boolean,
    completed: boolean
  ) {
    return this.http
      .patch<Appointment>(
        `${environment.apiURl}/appointments`,
        { appointmentId, canceled, completed },
        {
          headers: { authorization: `Bearer ${this.authService.token}` },
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }

  public clearErrors(): void {
    this.error.next(undefined);
  }
}
