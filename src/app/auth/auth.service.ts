import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private bearerToken = "";

  constructor(private httpClient: HttpClient, private router: Router) { }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  getToken() {
    return this.bearerToken;
  }

  setToken(token: string) {
    this.bearerToken = token;
  }

  auth(email: string, password: string) {
    const body = { email: email, password: new Md5().appendStr(password).end() };
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":8080" + "/login", body);
  }

  logout() {
    this.isLoggedIn = false;
  }

  login() {
    this.isLoggedIn = true;
  }
}
