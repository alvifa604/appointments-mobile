import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {}
  canActivate(): boolean | Observable<boolean> {
    if (this.userService.getIsLogged()) {
      return true;
    } else {
      this.router.navigate(['session']);
      return false;
    }
  }
}
