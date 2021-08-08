/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Appointment } from './models/Appointment';
import { User } from '../shared/models/User';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { AppointmentsService } from './services/appointments.service';
import { MedicalServicesService } from './services/medical-services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private appointmentsSubscription: Subscription;
  private medServicesSubscription: Subscription;

  public user = new Observable<User>();

  constructor(
    public userService: UserService,
    public appointmentsService: AppointmentsService,
    public medicalServicesS: MedicalServicesService,
    private auth: AuthService,
    private alertController: AlertController
  ) {}

  public loading = false;
  ngOnDestroy(): void {
    if (this.appointmentsSubscription) {
      this.appointmentsSubscription.unsubscribe();
    }

    if (this.medServicesSubscription) {
      this.medServicesSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.getAppointments();
    this.getMedicalServices();
    this.user = this.userService.user$;
  }

  public async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Desea cerrar la sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  private logout() {
    this.auth.logOut();
  }

  private getMedicalServices() {
    this.medServicesSubscription = this.medicalServicesS
      .getServices()
      .subscribe();
  }

  private getAppointments(): void {
    this.appointmentsSubscription = this.appointmentsService
      .getAppointments()
      .subscribe();
  }
}
