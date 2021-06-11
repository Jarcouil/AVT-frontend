import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from './user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public admin: string[] = ['Gebruiker', 'Admin'];
  public user: User;

  constructor(
    private auth: AuthService,
  ) {
    this.user = this.auth.getUserDetails();
  }

  /**
   * check if user in storage is admin
   *
   * @returns boolean
   */
  isAdmin(): boolean {
    return this.auth.isCurrentUserAdmin();
  }

  /**
   * Get text if user is admin
   *
   * @param i number
   *
   * @returns string
   */
  getAdminText(i: number): string {
    if (i === 0) {
      return 'Nee';
    } else {
      return 'Ja';
    }
  }
}
