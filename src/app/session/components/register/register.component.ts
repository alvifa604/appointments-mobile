/* eslint-disable curly */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Register } from 'src/app/shared/models/Register';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  //Form variables
  public registerForm = this.fb.group({
    idDocument: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(12),
        Validators.pattern('^[0-9]+$'),
      ]),
    ],
    name: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    firstLastname: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(30)]),
    ],
    secondLastname: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(30)]),
    ],
    birthDate: ['', [Validators.required]],
    email: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(30)]),
    ],
    phoneNumber: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9].{7,7}$'),
      ]),
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'
        ),
      ]),
    ],
    password2: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'
        ),
      ]),
    ],
  });

  private loader: HTMLIonLoadingElement;
  private registerFormValue: Register;
  private registerSubscription: Subscription;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  public register(): void {
    this.presentLoading();
    if (!this.registerForm.valid) return;

    this.registerFormValue = this.registerForm.value;
    this.registerSubscription = this.authService
      .register(this.registerFormValue)
      .pipe(
        catchError((error) => {
          this.loadingController.dismiss();
          return throwError(error);
        })
      )
      .subscribe((x) => {
        this.loader.dismiss();
        this.registerForm.reset();
        this.redirectToHome();
      });
  }

  private async presentLoading(): Promise<void> {
    this.loader = await this.loadingController.create({
      message: 'Registrando...',
    });
    await this.loader.present();
  }

  private redirectToHome() {
    this.router.navigate(['/home']);
  }
}
