import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  constructor(private httpClient: HttpClient, private router: Router) { }

  isAuthenticated() {
    return this.isLoggedIn
  }

  auth(email: string, password: string) {
    let body = { email: email, password: new Md5().appendStr(password).end() }

    this.httpClient.post<any>("http://localhost:8080/login", body).subscribe(resp => {
      if(resp.status == 200) {
        this.isLoggedIn = true
        this.router.navigate(['hidden'])
      }
    })
  }

  logout() {
    this.isLoggedIn = false;
  }
}
