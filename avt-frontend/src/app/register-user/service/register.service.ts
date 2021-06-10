import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Message, MessagesService } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:3000/v1/auth/register';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService) { }

  /**
   * register
   *
   * @param uploadForm FormData
   * @returns Observable<any>
   */
   register(uploadForm: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, uploadForm, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError<[]>( []))
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
      this.log(`${error.error.message}`, error.status);
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
