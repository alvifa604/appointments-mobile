import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ServicesComponent } from './components/services/services.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: AppointmentsComponent,
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: '**',
        component: AppointmentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
