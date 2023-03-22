import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  constructor(private httpClient: HttpClient) { }

  isAuthenticated() {
    return this.isLoggedIn
  }

  auth(email: string, password: string) {
    let body = {email: email, password: password}

    this.httpClient.post("http://localhost:8080/login", body).subscribe(resp => {
      this.isLoggedIn = true
    })
  }
}
