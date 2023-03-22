import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  constructor() { }

  isAuthenticated() {
    return this.isLoggedIn
  }

  auth(email: string, password: string) {
    this.isLoggedIn = true
  }
}
