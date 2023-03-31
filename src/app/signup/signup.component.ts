import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  email: any;
  password: any;
  showError: any = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

  }

  submit() {

  }

}
