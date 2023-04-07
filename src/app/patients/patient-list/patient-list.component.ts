import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientService } from '../patient.service';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patientList: any;
  displayedColumns: string[] = ['nome', 'cognome', 'email', 'link'];
  tipo = "";

  constructor(private patientService: PatientService, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserData().subscribe(resp => {
      if(resp.status == 200) {
        this.tipo = resp.body.tipo;
        this.refreshList();
      }
    });
  }

  refreshList() {
    if (this.tipo == "medico") {
      this.patientService.getPatients().subscribe(resp => {
        if(resp.status == 200) {
          this.patientList = resp.body;
        }
      });
    } else {
      this.userService.getAssistedPeople().subscribe(resp => {
        if(resp.status == 200) {
          this.patientList = resp.body;
        }
      });
    }
  }

  goToLink($event: any, link: string) {
    $event.preventDefault();

  }
}
