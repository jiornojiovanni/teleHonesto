import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) { }

  isAuthenticated() {
    return moment().isBefore(this.getExpiresAt());
  }

  getToken() {
    return localStorage.getItem("jwt_token");
  }

  private getExpiresAt() {
    const expiration = localStorage.getItem("expires_at");
    if(expiration != null) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return null;
    }
    
  }

  setToken(token: string, expiresIn: number) {
    const expiresAt = moment().add(expiresIn, 'second');
    localStorage.setItem("jwt_token", token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  getHeaderWithBearer() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  auth(email: string, password: string) {
    const body = { email: email, password: new Md5().appendStr(password).end() };
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":8080" + "/login", body, {
      observe: 'response'
    });
  }

  logout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("expires_at");
  }

}
