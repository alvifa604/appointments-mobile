import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Appointment } from 'src/app/shared/models/Appointment';
import { AppointmentsService } from './appointments.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsResolverService
  implements Resolve<Observable<Appointment[]>>
{
  private loader: HTMLIonLoadingElement;
  constructor(
    private loadingController: LoadingController,
    private appointmentsService: AppointmentsService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<Appointment[]>
    | Observable<Observable<Appointment[]>>
    | Promise<Observable<Appointment[]>> {
    this.presentLoading();

    const appointment$ = this.appointmentsService.appointments$.pipe(tap(() => this.loader.dismiss()));

    return appointment$;
    throw new Error('Method not implemented.');
  }

  private async presentLoading() {
    this.loader = await this.loadingController.create({
      message: 'Cargando citas',
    });
    await this.loader.present();
  }
}
