import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from './user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public user: User;
  public admin: string[] = ['Gebruiker', 'Admin'];

  constructor(
    private auth: AuthService,
  ) {
    this.user = this.auth.getUserDetails();
   }

  ngOnInit(): void {
  }

}
