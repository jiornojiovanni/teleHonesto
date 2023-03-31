import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}


  getPatients() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/patients',{
      headers: reqHeader,
      observe: 'response'
    });
  }
}
