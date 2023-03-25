import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserData().subscribe(user => {
      this.user = new User(user.nome, user.cognome);
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
