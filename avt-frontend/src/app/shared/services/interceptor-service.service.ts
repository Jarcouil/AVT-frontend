import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable({
  providedIn: 'root'
})


export class InterceptorService {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
  }

  /**
   * Intercept http request
   *
   * @param request HttpRequest
   * @param next HttpHandler
   *
   * @returns Observable<HttpEvent<any>>
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    const currentUser = this.auth.currentUserValue;

    if (token != null && currentUser) {
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') })
        .clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }

    return next.handle(request);
  }
}
