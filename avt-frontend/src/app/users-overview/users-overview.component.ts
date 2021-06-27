import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  sorting = {
    id: 'id',
    username: 'username',
    email: 'email',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
  };

  orders = {
    asc: 'asc',
    desc: 'desc',
  };

  sort = this.sorting.id;
  order = this.orders.asc;
  page = 0;
  perPage = 10;
  total = 0;

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
    this.getUsers(this.page);
    this.messagesService.clear();
  }

  /**
   * Sort users by selected item
   *
   * @param sortBy string
   * @returns void
   */
  sortUsers(sortBy: string): void {
    if (this.sort !== sortBy) {
      this.sort = sortBy;
    } else {
      this.toggleOrder();
    }
    this.getUsers(this.page);
  }

  /**
   * Toggle order by
   *
   * @returns void
   */
  toggleOrder(): void {
    this.order = (this.order === this.orders.asc) ? this.orders.desc : this.orders.asc;
  }

  /**
   * Get all users
   *
   * @returns void
   */
  getUsers(page: any): void {
    this.userOverviewService.getAllUsers(this.sort, this.order, page, this.perPage)
      .subscribe(response => {
        this.users = response.data;
        this.page = +response.pagination.currentPage;
        this.total = +response.pagination.total;
      });
  }

  /**
   * Get text if user is admin
   *
   * @param i number
   *
   * @returns string
   */
  getAdminText(i: number): string {
    return (i === 0) ? 'Nee' : 'Ja';
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
      if (confirm(`Weet je zeker dat je de administrator rechten van gebruiker ${user.username} wilt wijzigen?`)) {
        this.userOverviewService.toggleAdmin(user.id).subscribe(result => {
          this.getUsers(this.page);
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
    } else if (confirm(`Weet je zeker dat je gebruiker ${user.username} wilt verwijderen?`)) {
      this.userOverviewService.deleteUser(user.id).subscribe(result => {
        this.getUsers(this.page);
      });
    }
  }
}
