import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-hidden',
  templateUrl: './hidden.component.html',
  styleUrls: ['./hidden.component.scss']
})
export class HiddenComponent {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout()
  }
}
