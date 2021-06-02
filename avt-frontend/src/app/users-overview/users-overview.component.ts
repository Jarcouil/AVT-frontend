import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../account/user';
import { MessagesService } from '../shared/messages/messages.service';
import { AuthService } from '../shared/services/auth.service';
import { UsersOverviewService } from './service/users-overview.service';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {

  users: User[] = [];
  private user: User;

  constructor(
    private userOverviewService: UsersOverviewService,
    private messagesService: MessagesService,
    private auth: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(this.auth.getUser());
  }

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

  isChecked(value: number): boolean {
    return value === 1;
  }

  /**
   * toggle admin rights of a user
   *
   * @param user User
   */
  toggleAdmin(user: User): void {
    if (user.id === this.user.id) {
      this.reloadComponent();
      alert('Je kan niet je eigen administrator rechten niet wijzigen');
    } else {
      if (confirm('Weet je zeker dat je de administrator rechten van gebruiker ' + user.username + ' wilt wijzigen?')) {
        this.userOverviewService.toggleAdmin(user.id).subscribe(result => {
          this.getUsers();
        });
      } else {
        this.reloadComponent();
      }
    }
  }

  /**
   * Reload the component
   */
  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  /**
   * Delete user of given id and retreive users again
   *
   * @param user User
   *
   * @returns void
   */
  deleteUser(user: User): void {
    if (user.id === this.user.id) {
      alert('Je kan niet je eigen account verwijderen!');
    } else if (confirm('Weet je zeker dat je gebruiker ' + user.username + ' wilt verwijderen?')) {
      this.userOverviewService.deleteUser(user.id).subscribe(result => {
        this.getUsers();
      });
    }
  }
}
