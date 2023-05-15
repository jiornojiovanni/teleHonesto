import {  Component, Input, OnInit } from '@angular/core';
import { VisitService } from '../visit.service';
import { PageEvent, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  @Input() id_persona: number | undefined;
  visitList: any;
  pageEvent: PageEvent | undefined;
  pageSizeOptions = [5, 10, 25];
  showPageSizeOptions = true;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any, any>;
  editing = false;
  constructor(private visitService: VisitService, private userService: UserService) {
    userService.getUserData().subscribe(resp => {
      if(resp.body.tipo == "medico") {
        this.displayedColumns = ['nome', 'tipologia','data', 'ora', 'stato', 'peerjs', 'webrtc', 'kurento', 'editButton', 'deleteButton'];
      } else {
        this.displayedColumns = ['nome', 'tipologia','data', 'ora', 'stato', 'peerjs', 'webrtc', 'kurento', ];
      }
    });


  }

  ngOnInit() {
    this.refreshList();
    this.dataSource = new MatTableDataSource(this.visitList);
  }

  refreshList() {
    this.editing = false;
    if (this.id_persona == undefined) {
      this.visitService.getCountVisitList().subscribe(resp => {
        if (resp.status == 200) {
          this.length = resp.body.conto;
        }
      });

      this.visitService.getRangeVisitList(this.pageIndex, this.pageSize).subscribe(resp => {
        this.assignData(resp);
      });
    } else {
      this.visitService.getCountVisitListSpecificUser(this.id_persona).subscribe(resp => {
        if (resp.status == 200) {
          this.length = resp.body.conto;
        }
      });

      this.visitService.getRangeVisitListSpecificUser(this.id_persona, this.pageIndex, this.pageSize).subscribe(resp => {
        this.assignData(resp);
      });
    }
  }

  private assignData(data: any) {
    if (data.status == 200 && data.body != null) {
      this.visitList = data.body;
      this.visitList.forEach(async (element: any) => {
        const list = await this.getVisitName(element.id_visita);
        Object.assign(element, list);
        element.editable = false;
      });

      this.dataSource = new MatTableDataSource(this.visitList);
    }
  }

  //This only works for the current page, so it's not very useful
  /* applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  } */

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.refreshList();
    return event;
  }

  getVisitName(visitid: number) {
    return new Promise<any>((resolve) => {
      this.visitService.getVisitName(visitid).subscribe(resp => {
        if(resp.status == 200) {
          resolve( {name: resp.body.nome + " " + resp.body.cognome, type: resp.body.tipo});
        } else {
          resolve( {name: "", type: ""});
        }
      });
    });
  }

  edit(visit: any) {
    visit.editable = true;
    this.editing = true;
  }

  modify(visit: any) {
    this.visitService.updateVisit(visit.id_visita, visit.ora_programmata, visit.data_programmata, visit.stato).subscribe(resp => {
      visit.editable = false;
      this.editing = false;
    });
  }

  delete(visit: any) {
    this.visitService.deleteVisit(visit.id_visita).subscribe(resp => {
      this.refreshList();
    });
  }
}
