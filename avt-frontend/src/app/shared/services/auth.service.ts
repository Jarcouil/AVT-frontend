import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../account/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || ''));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Get current value
   *
   * @returns User
   */
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Get details of the user
   *
   * @returns User
   */
  getUserDetails(): User {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  }

  /**
   * Set data in local storage
   *
   * @param variableName string
   * @param data any
   *
   * @returns void
   */
  setDataInLocalStorage(variableName: string, data: any): void {
    localStorage.setItem(variableName, data);
  }

  /**
   * Set user in local storage
   *
   * @param user User
   *
   * @returns void
   */
  setUserInLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Return if current user is admin
   *
   * @returns boolean
   */
  isCurrentUserAdmin(): boolean {
    return this.currentUserSubject.value.isAdmin === 1;
  }

  /**
   * get access token from local storage
   *
   * @returns any
   */
  getToken(): any {
    return localStorage.getItem('accessToken');
  }

  /**
   * get user from local storage
   *
   * @returns any
   */
  getUser(): any {
    return localStorage.getItem('user');
  }

  /**
   * Clear local storage
   *
   * @returns void
   */
  clearStorage(): void {
    localStorage.clear();
  }

  /**
   * Remove user and accessToken from local storage
   *
   * @returns void
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
}
