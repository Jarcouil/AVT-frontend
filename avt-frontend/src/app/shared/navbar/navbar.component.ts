import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public selectedTab!: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    console.log(this.router.routerState.snapshot.url.replace(/\//g,''))
    this.selectedTab = this.router.routerState.snapshot.url.replace(/\//g,'') || 'measurements';
  }


  /**
   * logout and navigate to login page
   *
   * @returns void
   */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  /**
   * set select tab variable
   *
   * @param selectedTab string
   */
  setSelectedTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }
}
