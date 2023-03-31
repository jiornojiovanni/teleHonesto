import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  saveDocument(title: string, text: string, visitID: number, type: number) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/createdoc', {title: title, text: text, visitID: visitID, type: type}, {
      headers: reqHeader,
      observe: 'response'
    });
  }

  getDocuments() {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.get<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/documents',{
      headers: reqHeader,
      observe: 'response'
    });
  }

  getDocumentsFrom(patientID: number) {
    const reqHeader = this.authService.getHeaderWithBearer();

    return this.httpClient.post<any>("https://" + environment.apiLocation + ":" + environment.apiPort + '/documents',  {patientID: patientID},{
      headers: reqHeader,
      observe: 'response'
    });
  }

  uploudDocument(filedata: any) {
    return this.httpClient.post("https://" + environment.apiLocation + ":" + environment.apiPort + '/upload', filedata, {
      observe: 'response'
    });
  }
}
