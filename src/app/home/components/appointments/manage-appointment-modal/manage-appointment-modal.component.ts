/* eslint-disable curly */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppointmentEdit } from 'src/app/home/models/AppointmentEdit';
import { AppointmentsService } from 'src/app/home/services/appointments.service';
import { Appointment } from 'src/app/shared/models/Appointment';
import { UserService } from 'src/app/shared/services/user.service';

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
    private alertController: AlertController,
    private appointmenstService: AppointmentsService
  ) {}
  ngOnDestroy(): void {
    this.appointmentSubscription.unsubscribe();
  }

  ngOnInit() {
    console.log(this.appointment);
  }

  public updateAppointment() {
    if (this.cancel === undefined && this.complete === undefined) {
      this.presentAlert();
      return;
    }

    const cancel = this.cancel === 'true' ? true : false;
    const complete = this.complete === 'true' ? true : false;

    const edit: AppointmentEdit = {
      appointmentId: this.appointment.id,
      canceled: cancel,
      completed: complete,
    };

    this.appointmentSubscription = this.appointmenstService
      .updateAppointment(edit)
      .subscribe();

    this.modalController.dismiss();
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Advertencia',
      message: 'Debe editar al menos un campo',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
