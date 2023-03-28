import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';
import { UserService } from '../user/user.service';
import { Visit } from '../visit';
import { VisitService } from '../visit/visit.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = new User('', '', '', 0, '');
  visit = new Visit('', '', '', '');
  success = false;

  constructor(private authService: AuthService, private userService: UserService, private visitService: VisitService) {}

  ngOnInit() {
    this.userService.getUserData().subscribe(resp => {
      if(resp.status == 200) {
        this.user = new User(resp.body.nome, resp.body.cognome, resp.body.email, resp.body.id_persona, resp.body.tipo);
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onSubmit() {
    this.visitService.createVisit(this.visit).subscribe(resp => {
      if(resp.status == 200) {
        this.success = true;
      }
    });

  }
}
