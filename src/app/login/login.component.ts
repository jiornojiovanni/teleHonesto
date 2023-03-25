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
  showError: any = false;

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.authService.auth(this.email, this.password).subscribe(resp => {
      if(resp.status == 200) {
        this.authService.login();
        this.authService.setToken(resp.body.token);
        this.router.navigate(['profile']);
      } else {
        this.showError = true;
      }
    });
  }

}
