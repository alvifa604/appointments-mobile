/* eslint-disable curly */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private storage: Storage,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.storage.create();
    //Revisa si hay un token
    await this.authService.loadToken();
    //Inicia sesión con el token en caso de que no esté vencido
    if (this.authService.token) {
      this.authService
        .getCurrentUser()
        .subscribe((x) => this.router.navigate(['home']));
    }
  }

  ngOnDestroy(): void {}
}
