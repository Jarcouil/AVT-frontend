import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { catchError, map, tap } from 'rxjs/operators';
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

  postDadFile(uploadForm: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, uploadForm, {
      reportProgress: true,
      observe: 'events'
    })
      .pipe(
        map(event => this.getEventMessage(event)),
        tap(message => this.log(message, 200)),
        catchError(this.handleError<any>('postDadFile'))
      );
  }

  private getEventMessage(event: HttpEvent<any>): string {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading bestand.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        let percentDone = null;
        if (event.total) {
          percentDone = Math.round(100 * event.loaded / event.total);
        } else {
          percentDone = 0;
        }
        return `Bestand is ${percentDone}% geüpload.`;

      case HttpEventType.Response:
        return `Bestand is compleet verwerkt!`;

      default:
        return `Bestand surprising upload event: ${event.type}.`;
    }
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
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}
