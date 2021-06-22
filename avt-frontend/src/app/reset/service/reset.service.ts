import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Message, MessagesService } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  private apiUrl = 'http://localhost:3000/v1/auth';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService) { }

  /**
   * Update the password
   *
   * @param newPassword string
   * @param token string
   *
   * @returns Observable<any>
   */
  updatePassword(newPassword: string, token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/new-password`, { password: newPassword, resetToken: token }, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Request mail for reset
   *
   * @param resetRequest Formdata
   *
   * @returns Observable<any>
   */
  requestReset(resetRequest: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset`, resetRequest, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Check if token is valid
   *
   * @param token string
   *
   * @returns Observable<any>
   */
  ValidPasswordToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-valid`, { resetToken: token })
      .pipe(
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
