import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getUserData() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.httpClient.get<any>('http://localhost:8080/user', {
      headers: reqHeader,
    });
  }
}
