/* eslint-disable @typescript-eslint/member-ordering */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilitiesServicesService } from 'src/app/shared/services/utilities-services.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit, OnDestroy {
  private profileSubscription: Subscription;
  private roleSubscription: Subscription;

  public idDocument: string;
  public role: string;

  public roleForm: FormGroup;

  constructor(
    public userService: UserService,
    public rolesService: RolesService,
    public fb: FormBuilder,
    private utilitiesService: UtilitiesServicesService,
    private route: Router
  ) {}

  ngOnDestroy(): void {
    if (this.profileSubscription !== undefined) {
      this.profileSubscription.unsubscribe();
    }
    if (this.roleSubscription !== undefined) {
      this.roleSubscription.unsubscribe();
    }
  }

  ngOnInit() {}

  //Cambia el rol de un usuario
  public changeRole() {
    this.utilitiesService.presentLoading('Guardando cambios...');

    this.role = this.roleForm.get('role').value;
    this.roleSubscription = this.userService
      .changeRole(this.idDocument.toString(), this.role)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.utilitiesService.loadingController.dismiss();
          this.utilitiesService.presentToast(error.error, 'danger');
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.utilitiesService.loadingController.dismiss();
        this.utilitiesService.presentToast(
          'Se han guardado los cambios exitosamente',
          'success'
        );

        this.idDocument = '';
        this.userService.setProfile();

        this.route.navigate(['home']).then(() => {
          this.utilitiesService
            .presentLoading('Cargando...')
            .then(() => this.utilitiesService.loadingController.dismiss());

          if (this.idDocument === this.userService.getUserIdDocument()) {
            window.location.reload();
          }
        });
      });
  }

  public async getProfile() {
    await this.utilitiesService.presentLoading('Buscando usuario...');

    if (
      this.idDocument === undefined ||
      this.idDocument.toString().length > 12 ||
      this.idDocument.toString().length < 9
    ) {
      await this.utilitiesService.loadingController.dismiss();
      this.utilitiesService.presentOkAlert(
        'Advertencia',
        'Ingrese un número de cédula válido'
      );
      return;
    }
    await this.loadProfile();
  }

  //Carga el perfil del usuario al que se le cambiará el rol
  private async loadProfile() {
    this.profileSubscription = this.userService
      .getProfile(this.idDocument.toString())
      .pipe(
        catchError((error) => {
          this.utilitiesService.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.utilitiesService.loadingController.dismiss();
        this.loadRoles();
      });
  }

  //Carga los roles para que se usen en el select
  private async loadRoles() {
    await this.utilitiesService.presentLoading('Cargando roles...');
    this.rolesService
      .getRoles()
      .pipe(
        catchError((error) => {
          this.utilitiesService.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.roleForm = this.fb.group({
          role: [this.userService.getProfileRole(), Validators.required],
        });

        this.utilitiesService.loadingController.dismiss();
      });
  }
}
