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
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * handle error
   *
   * @param result T
   * @returns any
   */
  private handleError<T>(result?: T): any {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      this.log(`${error.error.message}`, 400);
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
      message: `${messageString}`,
      code: httpCode
    };
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}
