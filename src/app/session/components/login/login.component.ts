/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable curly */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from 'src/app/shared/models/Login';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  //Form variables
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private loginFormValue: Login;
  private loginSubscription: Subscription;
  private loader: HTMLIonLoadingElement;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    public loadingController: LoadingController,
    public userService: UserService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (!!this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  public login(): void {
    this.presentLoading();
    if (!this.loginForm.valid) return;

    this.loginFormValue = this.loginForm.value;
    this.loginSubscription = this.authService
      .login(this.loginFormValue)
      .pipe(
        catchError((error) => {
          this.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe((x) => {
        this.loader.dismiss();
        this.loginForm.reset();
        this.redirectToHome();
      });
  }

  private async presentLoading(): Promise<void> {
    this.loader = await this.loadingController.create({
      message: 'Iniciando sesión',
    });
    await this.loader.present();
  }

  private redirectToHome() {
    this.router.navigate(['/home']);
  }
}
