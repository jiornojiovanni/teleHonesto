import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  email: any;
  password: any;
  showError: any = false;

  constructor(private authService: AuthService, private router: Router) {}
 
  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['profile']);
    }
  }

  submit() {
    this.authService.auth(this.email, this.password).subscribe(resp => {
      if(resp.status == 200) {
        this.authService.setToken(resp.body.token, resp.body.expiresIn);
        this.router.navigate(['profile']);
      } else {
        this.showError = true;
      }
    });
  }

}
