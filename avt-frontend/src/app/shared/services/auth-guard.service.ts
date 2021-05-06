import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Check if the user is validated
   *
   * @param next ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   *
   * @returns boolean
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.getUserDetails();
    if (currentUser) {
      if (next.data.roles && next.data.roles.indexOf(currentUser.isAdmin) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/measurements']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // navigate to login page
    this.router.navigate(['/login']);
    return false;
  }
}
