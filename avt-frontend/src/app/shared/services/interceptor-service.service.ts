import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable({
  providedIn: 'root'
})


export class InterceptorService {

  constructor(
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
    const currentUser = this.auth.getUser();

    if (token != null && currentUser) {
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') })
        .clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }

    return next.handle(request);
  }
}
