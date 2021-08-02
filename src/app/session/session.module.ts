import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SessionPageRoutingModule } from './session-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SessionComponent } from './session.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionPageRoutingModule,
    ReactiveFormsModule,
    SessionPageRoutingModule
  ],
  declarations: [SessionComponent, LoginComponent, RegisterComponent],
})
export class SessionModule {}
