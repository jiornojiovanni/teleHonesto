import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  documentList: any;
  displayedColumns: string[] = ['nome', 'creazione', 'link'];

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.documentService.getDocuments().subscribe(resp => {
      if(resp.status == 200) {
        this.documentList = resp.body;
      }
    });
  }

  goToLink(link: string) {
    window.open("https://" + environment.apiLocation + ":8080" + link, "_blank");
  }
}
