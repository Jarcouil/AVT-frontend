import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Message, MessagesService } from '../messages/messages.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService) { }

  /**
   * Check if the user is validated
   *
   * @param next ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   *
   * @returns boolean
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const timer = JSON.parse(this.authService.getTimer());
    if (timer && (Date.now() > timer)) {
      this.authService.logout();
      const message: Message = {
        message: `Je bent automatisch uitgelogd.`,
        code: 400
      };
      this.messagesService.add(message);
    }

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
