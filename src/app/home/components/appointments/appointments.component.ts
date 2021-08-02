/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Appointment } from 'src/app/shared/models/Appointment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
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
    private appointmentsService: AppointmentsService,
    public authService: AuthService,
    public userSerivce: UserService,
    private modalController: ModalController
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
    return await modal.present();
  }

  public doRefresh(event): void {
    this.getAppointments();
    event.target.complete();
  }

  public getAppointments() {
    if (this.appointmentsSubscription !== undefined) {
      this.appointmentsSubscription.unsubscribe();
    }
    this.appointmentsSubscription = this.appointmentsService
      .getAppointments()
      .subscribe();
  }
}
