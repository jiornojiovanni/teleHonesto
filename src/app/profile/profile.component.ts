import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserData()
  }

  onLogout() {
    this.authService.logout()
  }
}
