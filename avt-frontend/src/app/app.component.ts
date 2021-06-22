import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'avt-frontend';

  constructor(
    private auth: AuthService,
  ) {}

  loggedIn(): boolean {
    return (this.auth.getToken()) ?  true : false;
  }
}
