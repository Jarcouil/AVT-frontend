import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Message, MessagesService } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/v1/auth/login';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService) { }

  /**
   * login
   *
   * @param uploadForm FormData
   * @returns Observable<any>
   */
  login(uploadForm: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, uploadForm)
      .pipe(
        tap(_ => this.log('Logged in', 200)),
        catchError(this.handleError<[]>('login', []))
      );
  }

  /**
   * handle error
   *
   * @param operation string
   * @param result T
   * @returns any
   */
  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`, 400);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * log message with http code
   *
   * @param messageString string
   * @param httpCode number
   *
   * @returns void
   */
  private log(messageString: string, httpCode: number): void {
    const message: Message = {
      message: `Loginservice: ${messageString}`,
      code: httpCode
    };
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}
