import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MedicalServicesService } from 'src/app/home/services/medical-services.service';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  @Output() closeFormEvent = new EventEmitter<boolean>();

  public serviceName: string;
  private createSubscription: Subscription;

  constructor(
    public medServiceS: MedicalServicesService,
    private utilitiesService: UtilitiesServicesService
  ) {}

  ngOnDestroy(): void {
    if (this.createSubscription !== undefined) {
      this.createSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

  public createService() {
    if (this.serviceName === undefined) {
      this.utilitiesService.presentOkAlert(
        'Advertencia',
        'Ingrese el nombre del servicio'
      );
      return;
    }

    this.utilitiesService.presentLoading('Guardando el servicio...');
    this.createSubscription = this.medServiceS
      .createService(this.serviceName)
      .pipe(
        catchError((error) => {
          this.utilitiesService.presentToast(
            'Ocurrió un error guardando el servicio',
            'danger'
          );
          this.utilitiesService.loadingController
            .dismiss()
            .finally(() => throwError(error));
          return throwError(error);
        })
      )
      .subscribe((x) => {
        this.utilitiesService.loadingController.dismiss();
        this.utilitiesService.presentToast(
          'Se ha guardado el servicio exitosamente',
          'success'
        );
        //window.location.reload();
        this.closeFormEvent.emit();
        this.medServiceS.resetError();
      });
  }
}
