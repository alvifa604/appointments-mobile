import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesServicesService {
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  public async presentOkAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  public async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
  }

  public async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      position: 'top',
      message,
      color,
      duration: 2000,
    });
    toast.present();
  }
}
