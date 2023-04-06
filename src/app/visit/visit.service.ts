import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Visit } from '../visit';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  getVisitList() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visit',{
      headers: reqHeader,
      observe: 'response'
    });
  }

  createVisit(visit: Visit) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.put<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visit', visit,{
      headers: reqHeader,
      observe: 'response'
    });
  }

  deleteVisit(id_visita: string) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.delete<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visit', {
      headers: reqHeader,
      body: {
        id_visita: id_visita
      },
      observe: 'response'
    });
  }

  updateVisit(id_visita: string, newTime: string, newDate: string) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visit', {
      ora: newTime,
      data: newDate,
      id_visita: id_visita
    },{
      headers: reqHeader,
      observe: 'response'
    });
  }

  getVisitPartecipants(visitID: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("visitID", visitID);
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visitpartecipants',{
      headers: reqHeader,
      params: queryParams,
      observe: 'response'
    });
  }

  updateJoinTime(visitID: number) {
    const reqHeader = this.authService.getHeaderWithBearer();
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/updatevisit', { visitID: visitID }, {
      headers: reqHeader,
      observe: 'response'
    });
  }

  //Can be called multiple times with no problems in the same call
  startVisit(visitID: number) {
    const reqHeader = this.authService.getHeaderWithBearer();
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/startvisit', { visitID: visitID }, {
      headers: reqHeader,
      observe: 'response'
    });
  }

  //Same for stopvisit
  stopVisit(visitID: number) {
    const reqHeader = this.authService.getHeaderWithBearer();
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/stopvisit', { visitID: visitID }, {
      headers: reqHeader,
      observe: 'response'
    });
  }

  getVisitName(visitid: number) {
    const reqHeader = this.authService.getHeaderWithBearer();
    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/visitname', { visitid: visitid }, {
      headers: reqHeader,
      observe: 'response'
    });
  }
}
