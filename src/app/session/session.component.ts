import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-session',
  templateUrl: '../session/session.component.html',
})
export class SessionComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}
}
