import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:3000/v1/file/upload-file';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  postDadFile(uploadForm: FormData): Observable<any> {  
    return this.http.post<any>(this.apiUrl, uploadForm, {
      reportProgress: true,
      observe: 'events'
    })
      .pipe(
        tap(_ => this.log('Posted dad file', 200)),
        catchError(this.handleError<any>('postDadFile'))
      )
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

  private log(messageString: string, code: number) {
    let message: Message = {
      message: `UploadServiceService: ${messageString}`,
      code: code
    };

    this.messagesService.add(message);
  }
}
