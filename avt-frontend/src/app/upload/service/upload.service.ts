import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:3000/v1/file/upload-file';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  /**
   * Post dad file to API
   *
   * @param uploadForm FormData
   * @returns Observable<any>
   */
  postDadFile(uploadForm: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, uploadForm, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError<any>('postDadFile'))
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
      this.log(`${error.message}`, 400);
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
