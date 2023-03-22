import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: any;
  password: any;

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.authService.auth(this.email, this.password)
  }

}
