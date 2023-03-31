import { Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../visit.service';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  @Input() id_persona: number | undefined;
  visitList: any;
  displayedColumns: string[] = ['nome','data', 'ora', 'stato', 'peerjs', 'webrtc'];
  names: string[] = [];
  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.visitService.getVisitList().subscribe(resp => {
      if(resp.status == 200 && resp.body != null) {
        this.visitList = resp.body;
        this.visitList.forEach((element: { id_visita: number; }) => {
          this.getVisitName(element.id_visita);
        });
      }
    });

  }

  getVisitName(visitid: number) {
    this.visitService.getVisitName(visitid).subscribe(resp => {
      if(resp.status == 200) {
        this.names[visitid] = resp.body.nome + " " + resp.body.cognome;
      } else {
        this.names[visitid] = "";
      }
    });
  }
}
