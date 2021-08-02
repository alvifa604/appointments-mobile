import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Service } from '../../models/Service';
import { MedicalServicesService } from '../../services/medical-services.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  public medServices: Service[];
  private medServicesSubscription: Subscription;

  constructor(
    public medService: MedicalServicesService,
    private loadingController: LoadingController
  ) {}

  ngOnDestroy(): void {
    this.medServicesSubscription.unsubscribe();
  }

  ngOnInit() {
    this.medServicesSubscription = this.medService.getServices().subscribe();
  }

  private async presentLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando servicios médicos...',
    });
    await loading.present();
  }
}
