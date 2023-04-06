import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../document/document.service';
@Component({
  selector: 'app-call-form',
  templateUrl: './call-form.component.html',
  styleUrls: ['./call-form.component.scss']
})
export class CallFormComponent {
  fileName: any;

  @Input() visitID = 0;
  title = '';
  text = '';
  fileUplouded = false;
  selectedFile: File | undefined = undefined;

  constructor(private documentService: DocumentService) {}

  submit() {
    this.documentService.saveDocument(this.title, this.text, this.visitID).subscribe(resp => {
      if (resp.status == 200) {
        window.open("https://" + environment.apiLocation + ":" + environment.apiPort + resp.body.uri, "_blank");
      }
    });
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  fileSubmit() {
    this.fileUplouded = false;
    const fd = new FormData();
    if (this.selectedFile != undefined) {
      fd.append('file', this.selectedFile, this.selectedFile.name);
      fd.append('visitID', this.visitID.toString());
      this.documentService.uploudDocument(fd).subscribe(resp => {
        if (resp.status == 200) {
          this.fileUplouded = true;
        }
      });
    }
  }
}
