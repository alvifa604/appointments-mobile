/* eslint-disable curly */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppointmentEdit } from 'src/app/home/models/AppointmentEdit';
import { AppointmentsService } from 'src/app/home/services/appointments.service';
import { Appointment } from 'src/app/home/models/Appointment';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';

@Component({
  selector: 'app-manage-appointment-modal',
  templateUrl: './manage-appointment-modal.component.html',
  styleUrls: ['./manage-appointment-modal.component.scss'],
})
export class ManageAppointmentModalComponent implements OnInit, OnDestroy {
  @Input() appointment: Appointment;
  public cancel: string;
  public complete: string;

  private appointmentSubscription: Subscription;

  constructor(
    public userService: UserService,
    private modalController: ModalController,
    private appointmenstService: AppointmentsService,
    private utilitiesService: UtilitiesServicesService
  ) {}
  ngOnDestroy(): void {
    if (this.appointmentSubscription !== undefined) {
      this.appointmentSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

  public closeModal() {
    this.modalController.dismiss();
  }

  public updateAppointment() {
    this.utilitiesService.presentLoading('Actualizando');

    if (this.cancel === undefined && this.complete === undefined) {
      this.utilitiesService.presentOkAlert(
        'Advertencia',
        'Debe editar al menos un campo'
      );
      return;
    }

    const canceled = this.cancel === 'true' ? true : false;
    const completed = this.complete === 'true' ? true : false;

    this.appointmentSubscription = this.appointmenstService
      .updateAppointment(this.appointment.id, canceled, completed)
      .pipe(catchError((error) => throwError(error)))
      .subscribe(() => {
        this.utilitiesService.loadingController.dismiss();
        this.modalController.dismiss();
      });
  }
}
