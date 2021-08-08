import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';
import { MedicalServicesService } from '../../services/medical-services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  public showCreate = false;

  private medServicesSubscription: Subscription;

  constructor(
    public medicalServicesS: MedicalServicesService,
    private alertController: AlertController,
    private utilitiesService: UtilitiesServicesService
  ) {}

  ngOnDestroy(): void {
    if (this.medServicesSubscription !== undefined) {
      this.medServicesSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

  public async deleteAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar servicio',
      message: '¿Desea eliminar el servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.utilitiesService.presentLoading('Eliminando el servicio...');
            this.deleteService(id);
          },
        },
      ],
    });

    await alert.present();
  }

  public toggleCreate() {
    this.showCreate = !this.showCreate;
  }

  public doRefresh(event) {
    this.medServicesSubscription = this.medicalServicesS
      .getServices()
      .subscribe();
    event.target.complete();
  }

  private deleteService(id: number): void {
    this.medicalServicesS
      .deleteService(id)
      .pipe(
        catchError((error) => {
          this.utilitiesService.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe((x) => {
        this.utilitiesService.loadingController.dismiss();
        this.utilitiesService.presentToast(
          'Se ha eliminado el servicio satisfactoriamente',
          'success'
        );
      });
  }
}
