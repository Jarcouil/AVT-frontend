import { Component, OnInit } from '@angular/core';
import { User } from '../account/user';
import { MessagesService } from '../shared/messages/messages.service';
import { UsersOverviewService } from './service/users-overview.service';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {

  users: User[] = [];

  constructor(
    private userOverviewService: UsersOverviewService,
    private messagesService: MessagesService
  ) { }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getUsers();
    this.messagesService.clear();
  }

  /**
   * Get all users
   *
   * @returns void
   */
  getUsers(): void {
    this.userOverviewService.getAllUsers().subscribe(users => this.users = users);
  }

  /**
   * Get username of user with given id
   *
   * @param id number
   *
   * @returns username
   */
  getUserNameOfId(id: number): string {
    return this.users.find(user => user.id === id)?.username || 'gebruikersnaam';
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

  /**
   * Delete user of given id and retreive users again
   *
   * @param id number
   *
   * @returns void
   */
  deleteUser(id: number): void {
    if (confirm('Weet je zeker dat je gebruiker ' + this.getUserNameOfId(id) + ' wilt verwijderen?')) {
      this.userOverviewService.deleteUser(id).subscribe();
      this.getUsers();
    }
  }
}
