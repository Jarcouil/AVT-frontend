import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
  }

  getUserDetails(): string {
    return localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') || '') : null;
  }

  setDataInLocalStorage(variableName: string, data: any): void {
    localStorage.setItem(variableName, data);
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  clearStorage(): void {
    localStorage.clear();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
