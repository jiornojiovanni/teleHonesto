import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { VisitService } from '../visit.service';
import {MatPaginator, PageEvent, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  @Input() id_persona: number | undefined;
  visitList: any;
  pageEvent: PageEvent | undefined;
  datasource: null | undefined;
  pageSizeOptions = [5, 10, 25];
  showPageSizeOptions = true;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  displayedColumns: string[] = ['nome', 'tipologia','data', 'ora', 'stato', 'peerjs', 'webrtc'];
  names: string[] = [];
  types: string[] = [];
  dataSource: any;
  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.refreshList();
    this.dataSource = new MatTableDataSource(this.visitList);
  }

  refreshList() {
    this.visitService.getCountVisitList().subscribe(resp => {
      if(resp.status == 200) {
        this.length = resp.body.conto;
      }
    });

    this.visitService.getRangeVisitList(this.pageIndex, this.pageSize).subscribe(resp => {
        if (resp.status == 200 && resp.body != null) {
            this.visitList = resp.body;
            this.datasource = this.visitList.data;

            this.visitList.forEach((element: { id_visita: number; }) => {
                this.getVisitName(element.id_visita);
            });
        }
    });
}


onPageChange(event: PageEvent) {
  this.pageEvent = event;
  this.length = event.length;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.refreshList();
  return event;
}

  getVisitName(visitid: number) {
    this.visitService.getVisitName(visitid).subscribe(resp => {
      if(resp.status == 200) {
        this.names[visitid] = resp.body.nome + " " + resp.body.cognome;
        this.types[visitid] = resp.body.tipo;
      } else {
        this.names[visitid] = "";
        this.types[visitid] = "";
      }
    });
  }
}
