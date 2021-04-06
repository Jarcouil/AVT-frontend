import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class TwodimensionalgraphService {
  private apiUrl = 'http://localhost:3000/v1/measurement';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  getAllColumns(name: string): Observable<[]> {
    const url = `${this.apiUrl}/columns/${name}`;
    return this.http.get<[]>(url)
      .pipe(
        // tap(_ => this.log('fetched columns',200)),
        catchError(this.handleError<[]>('getAllColumns', []))
      );
  }

  getAllIds(name: string): Observable<[]> {
    const url = `${this.apiUrl}/id/${name}`;
    return this.http.get<[]>(url)
      .pipe(
        // tap(_ => this.log('fetched ids',200)),
        catchError(this.handleError<[]>('getAllIds', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`, 400);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(messageString: string, httpCode: number): void {
    const message: Message = {
      message: `UploadService: ${messageString}`,
      code: httpCode
    };
    this.messagesService.add(message);
  }
}
