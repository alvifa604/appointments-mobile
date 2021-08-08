/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Appointment } from 'src/app/home/models/Appointment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';
import { AppointmentsService } from '../../services/appointments.service';
import { ManageAppointmentModalComponent } from './manage-appointment-modal/manage-appointment-modal.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  public appointments$ = new Observable<Appointment[]>();
  private appointmentsSubscription: Subscription;

  constructor(
    public userSerivce: UserService,
    public authService: AuthService,
    private appointmentsService: AppointmentsService,
    private modalController: ModalController,
    private utilitiesService: UtilitiesServicesService
  ) {}
  ngOnDestroy(): void {
    if (this.appointmentsSubscription !== undefined) {
      this.appointmentsSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.appointments$ = this.appointmentsService.appointments$;
  }

  async manageAppointment(appointment: Appointment) {
    const modal = await this.modalController.create({
      component: ManageAppointmentModalComponent,
      componentProps: { appointment },
    });
    modal.onDidDismiss().then(() => this.getAppointments());
    return await modal.present();
  }

  public doRefresh(event) {
    window.location.reload();
    event.target.complete();
  }

  public getAppointments() {
    this.utilitiesService.presentLoading('Cargando citas...');
    if (this.appointmentsSubscription !== undefined) {
      this.appointmentsSubscription.unsubscribe();
    }

    this.appointmentsSubscription = this.appointmentsService
      .getAppointments()
      .subscribe(() => this.utilitiesService.loadingController.dismiss());
  }
}
