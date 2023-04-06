import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { VisitService } from '../visit.service';
import {MatPaginator, PageEvent, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit, AfterViewInit {
  @Input() id_persona: number | undefined;
  visitList: any;
  pageEvent: PageEvent | undefined;
datasource: null | undefined;
pageIndex=0;
pageSize=5;
length:number | undefined;
  displayedColumns: string[] = ['nome', 'tipologia','data', 'ora', 'stato', 'peerjs', 'webrtc'];
  names: string[] = [];
  types: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined ;
  dataSource: any;

  ngAfterViewInit() {
    this.visitList.paginator = this.paginator;
  }
  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.refreshList();
    this.dataSource = new MatTableDataSource(this.visitList);
  }

  refreshList() {
    this.visitService.getRangeVisitList(this.pageIndex, this.pageSize).subscribe(resp => {
        if (resp.status == 200 && resp.body != null) {
            this.visitList = resp.body;
            this.datasource = this.visitList.data;
            this.pageIndex = this.visitList.pageIndex;
            this.pageSize = this.visitList.pageSize;
            this.length = this.visitList.length;
            this.visitList.forEach((element: { id_visita: number; }) => {
                this.getVisitName(element.id_visita);
            });
        }
    });
}


onPageChange(event: PageEvent) {
  console.table(event);
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
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
