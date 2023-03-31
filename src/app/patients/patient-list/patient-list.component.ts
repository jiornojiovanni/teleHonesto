import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientService } from '../patient.service';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patientList: any;
  displayedColumns: string[] = ['nome', 'creazione', 'link'];


  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.patientService.getPatients().subscribe(resp => {
      if(resp.status == 200) {
        this.patientList = resp.body;
      }
    });
  }

  goToLink($event: any, link: string) {
    $event.preventDefault();
    
  }
}
