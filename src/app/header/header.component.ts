import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User = new User('', '', '', 0, '');
  constructor(private authService: AuthService, private userService: UserService) {}
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
}
