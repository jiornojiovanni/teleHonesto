import { Component, OnInit } from '@angular/core';
import { Visit } from 'src/app/visit';
import { VisitService } from '../visit.service';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  visitList: any;
  displayedColumns: string[] = ['data', 'ora', "link"];

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
