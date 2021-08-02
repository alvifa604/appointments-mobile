import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ManageAppointmentModalComponent } from './components/appointments/manage-appointment-modal/manage-appointment-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    ScheduleComponent,
    AppointmentsComponent,
    ManageAppointmentModalComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, HomeRoutingModule],
  providers: [],
})
export class HomeModule {}
