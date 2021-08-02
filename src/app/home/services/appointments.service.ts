/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment } from 'src/app/shared/models/Appointment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
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
          this.appointments.next(appointments);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error.message);
        })
      );
  }

  public createAppoinment() {}

  public updateAppointment(edit: AppointmentEdit) {
    console.log(edit);
    return this.http
      .put(`${environment.apiURl}/appointments`, edit, {
        headers: { authorization: `Bearer ${this.authService.token}` },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error.next(error.error);
          return throwError(error);
        })
      );
  }
}
