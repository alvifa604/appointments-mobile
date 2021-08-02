/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Appointment } from '../shared/models/Appointment';
import { User } from '../shared/models/User';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { AppointmentsService } from './services/appointments.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private appointmentsSubscription: Subscription;

  public user = new Observable<User>();

  constructor(
    public userService: UserService,
    public appointmentsService: AppointmentsService,
    private auth: AuthService,
    private loadingController: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.appointmentsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.user = this.userService.user$;
    this.getAppointments();
  }

  logout() {
    this.auth.logOut();
  }

  private getAppointments(): void {
    this.appointmentsSubscription = this.appointmentsService
      .getAppointments()
      .subscribe();
  }
}
