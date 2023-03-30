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

    return this.httpClient.post<any>("https://" + environment.apiLocation + ":8080" + '/createdoc', {title: title, text: text, visitID: visitID, type: type}, {
      headers: reqHeader,
      observe: 'response'
    });
  }
}
