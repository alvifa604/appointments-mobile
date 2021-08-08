import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ManageAppointmentModalComponent } from './components/appointments/manage-appointment-modal/manage-appointment-modal.component';
import { ServicesComponent } from './components/services/services.component';
import { CreateServiceComponent } from './components/services/create-service/create-service.component';
import { RolesComponent } from './components/roles/roles.component';

@NgModule({
  declarations: [
    HomeComponent,
    RolesComponent,
    ScheduleComponent,
    ServicesComponent,
    AppointmentsComponent,
    CreateServiceComponent,
    ManageAppointmentModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class HomeModule {}
