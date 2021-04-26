import { Injectable } from '@angular/core';
import { User } from '../../account/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
  }

  getUserDetails(): User {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  }

  setDataInLocalStorage(variableName: string, data: any): void {
    localStorage.setItem(variableName, data);
  }

  setUserInLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): any {
    return localStorage.getItem('accessToken');
  }

  getUser(): any {
    return localStorage.getItem('user');
  }

  clearStorage(): void {
    localStorage.clear();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }
}
