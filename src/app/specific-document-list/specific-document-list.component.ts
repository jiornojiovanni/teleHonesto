import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../document/document.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-specific-document-list',
  templateUrl: './specific-document-list.component.html',
  styleUrls: ['./specific-document-list.component.scss']
})
export class SpecificDocumentListComponent implements OnInit {

  documentList: any;
  displayedColumns: string[] = ['nome', 'creazione', 'link'];
  patientID: number = this.activatedRoute.snapshot.params["patientId"];
  patient: any = [''];
  constructor(private documentService: DocumentService, private activatedRoute: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.refreshList();

    
    this.userService.getPatient(this.patientID).subscribe(resp => {
      
      if(resp.status == 200) {
      this.patient = resp.body;
      
      }
    });
  }

  refreshList() {
    this.documentService.getDocumentsFrom(this.patientID).subscribe(resp => {
      if(resp.status == 200) {
        this.documentList = resp.body;
      }
    });
  }



  goToLink($event: MouseEvent, link: string) {
    $event.preventDefault();
    window.open("https://" + environment.apiLocation + ":" + environment.apiPort + link, "_blank");
  }
}
