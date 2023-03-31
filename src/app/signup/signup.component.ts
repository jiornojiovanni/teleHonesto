import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { UserService } from '../user/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: any;
  password: any;
  nome: any;
  cognome: any;
  telefono: any;
  specializzazione: any;
  cap: any;
  provincia: any;
  tipo: any;
  data: any;
  specialistList: any;
  constructor(private userService: UserService, private router: Router) {
    this.retrieveSpecialties();
  }

  submit() {
    if(this.specializzazione === undefined) {
      this.specializzazione = "";
    }

    this.userService.signup({
      nome: this.nome,
      cognome: this.cognome,
      mail: this.email,
      password: new Md5().appendStr(this.password).end(),
      telefono: this.telefono,
      data_nascita: this.data,
      provincia: this.provincia,
      cap: this.cap,
      tipo: this.tipo,
      fk_specializzazione: this.specializzazione
    }).subscribe(resp=> {
      if(resp.status == 200) {
        this.router.navigate(['']);
      }
    });
  }

  retrieveSpecialties() {
    this.userService.getSpecialties().subscribe(resp => {
      if(resp.status == 200) {
        this.specialistList = resp.body;
        console.log(resp.body);
      }
    });
  }
}
