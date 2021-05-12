import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private apiUrl = 'http://localhost:3000/v1/file';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  downloadDadFile(measurmentId: number): Observable<Blob> {
    return this.http.get(this.apiUrl + '/download-file/' + measurmentId, {
      responseType: 'blob'
    })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  getCSV(measurmentId: number, exportForm: FormData): Observable<Blob> {
    let parameters = new HttpParams();
    parameters = parameters.append('minWavelength', exportForm.get('minWaveLength')?.toString() || '');
    parameters = parameters.append('maxWavelength', exportForm.get('maxWaveLength')?.toString() || '');
    parameters = parameters.append('minTimestamp', exportForm.get('minTimestamp')?.toString() || '');
    parameters = parameters.append('maxTimestamp', exportForm.get('maxTimestamp')?.toString() || '');

    return this.http.get(this.apiUrl + '/csv/' + measurmentId, {
      params: parameters,
      responseType: 'blob'
    })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  getDadFileName(measurmentId: number): Observable<File> {
    return this.http.get<File>(this.apiUrl + '/file-name/' + measurmentId)
      .pipe(
        // tap(message => this.log(message, 200)),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`, 400);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(messageString: string, httpCode: number): void {
    const message: Message = {
      message: `${messageString}`,
      code: httpCode
    };
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}

export interface File {
  fileName: string;
}
