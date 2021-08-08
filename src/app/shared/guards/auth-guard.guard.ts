import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(): boolean | Observable<boolean> {
    if (this.userService.getIsLogged()) {
      return true;
    } else {
      this.router.navigate(['session']);
      return false;
    }
  }
}
