/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';
import { AppointmentCreate } from '../../models/AppointmentCreate';
import { Service } from '../../models/Service';
import { AppointmentsService } from '../../services/appointments.service';
import { MedicalServicesService } from '../../services/medical-services.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private medServicesSubscription: Subscription;
  private appointmentSubscription: Subscription;
  public mServices$ = new Observable<Service[]>();

  public appointmentForm = this.fb.group({
    idDocument: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(12),
      ]),
    ],
    date: ['', Validators.required],
    time: ['', Validators.required],
    service: ['', Validators.required],
  });

  constructor(
    private utilitiesService: UtilitiesServicesService,
    public medicalServicesS: MedicalServicesService,
    public fb: FormBuilder,
    public appointmentService: AppointmentsService
  ) {}

  ngOnDestroy(): void {
    if (this.medServicesSubscription !== undefined) {
      this.medServicesSubscription.unsubscribe();
    }
    if (this.appointmentSubscription !== undefined) {
      this.appointmentSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

  public schedule() {
    this.utilitiesService.presentLoading('Agendando cita...');
    this.appointmentService.clearErrors();
    const date = this.getDate();
    const time = this.getTime();
    const hours = time.split(':')[0];

    if (!this.isTimeValid(+hours)) {
      return;
    }

    const newAppointment: AppointmentCreate = {
      pacientIdDocument: this.appointmentForm.get('idDocument').value,
      serviceId: this.appointmentForm.get('service').value,
      date: this.createDateObject(date, time),
    };

    this.appointmentSubscription = this.appointmentService
      .createAppoinment(newAppointment)
      .pipe(
        catchError((error) => {
          this.utilitiesService.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe((x) => {
        this.utilitiesService.loadingController.dismiss();
        this.utilitiesService.presentToast(
          'Cita agendada exitosamente',
          'success'
        );
        this.appointmentForm.reset();
      });
  }

  private getDate(): string {
    const date = this.appointmentForm.get('date').value;
    const newDate = date.split('T')[0];
    return newDate;
  }

  private getTime(): string {
    const time: string = this.appointmentForm.get('time').value.split('T')[1];

    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];

    const newTime = hours + ':' + minutes;
    return newTime;
  }

  private isTimeValid(hours: number): boolean {
    if (hours > 18 || hours < 9) {
      this.utilitiesService.presentOkAlert(
        'Advertencia',
        'El horario de atención es de 9:00A.M. a 6:00P.M'
      );
      return false;
    }

    return true;
  }

  private createDateObject(date: string, time: string): Date {
    return new Date(
      +date.split('-')[0],
      +date.split('-')[1] - 1,
      +date.split('-')[2],
      +time.split(':')[0],
      +time.split(':')[1]
    );
  }
}
