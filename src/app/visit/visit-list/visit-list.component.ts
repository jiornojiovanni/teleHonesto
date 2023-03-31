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
  displayedColumns: string[] = ['data', 'ora', 'stato', 'peerjs', 'webrtc'];

  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.visitService.getVisitList().subscribe(resp => {
      if(resp.status == 200 && resp.body != null) {
        this.visitList = resp.body;
      }
    });
  }
}
