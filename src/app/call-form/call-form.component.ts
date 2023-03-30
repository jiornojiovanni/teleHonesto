import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../document/document.service';

@Component({
  selector: 'app-call-form',
  templateUrl: './call-form.component.html',
  styleUrls: ['./call-form.component.scss']
})
export class CallFormComponent {
  title = '';
  text = '';

  constructor(private documentService: DocumentService) {}

  submit() {
    this.documentService.saveDocument(this.title, this.text).subscribe(resp => {
      if (resp.status == 200) {
        window.open("https://" + environment.apiLocation + ":8080/" + resp.body.uri + ".pdf" , "_blank");
      }
    });
  }
}
