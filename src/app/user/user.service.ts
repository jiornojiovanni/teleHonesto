import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getUserData() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/user', {
      headers: reqHeader,
      observe: 'response'
    });
  }

  getPatients() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/patients', {
      headers: reqHeader,
      observe: 'response'
    });
  }

  getPatient(id_persona: number) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/patient',{id: id_persona}, {
      headers: reqHeader,
      observe: 'response'
    });
  }

  getAllPatients() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/allpatients', {
      headers: reqHeader,
      observe: 'response'
    });
  }

  signup(user: any) {
    return this.httpClient.put<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/user', user,{
      observe: 'response'
    });
  }

  getSpecialties() {
    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/specialties', {
      observe: 'response'
    });
  }

  getDoctors() {
    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/doctors', {
      observe: 'response'
    });
  }

  getCaregivers() {
    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/caregivers', {
      observe: 'response'
    });
  }

  getAssistedPeople() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/peopleassisted', {
      headers: reqHeader,
      observe: 'response'
    });
  }

  deleteAllData() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.delete<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/deleteuser', {
      headers: reqHeader,
      observe: 'response'
    });
  }

  downloadAllData() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get("https://" + environment.apiLocation + ":" + environment.apiPort + '/takeout', {
      headers: reqHeader,
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }
}
