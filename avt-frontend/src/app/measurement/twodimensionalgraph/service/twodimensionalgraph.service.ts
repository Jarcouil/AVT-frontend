import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { WavelengthsOfId } from '../twodimensionalgraph.component';

@Injectable({
  providedIn: 'root'
})
export class TwodimensionalgraphService {
  private apiUrl = 'http://localhost:3000/v1/measurement';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  getAllWavelengths(name: string): Observable<[]> {
    const url = `${this.apiUrl}/columns/${name}`;
    return this.http.get<[]>(url)
      .pipe(
        // tap(_ => this.log('fetched columns',200)),
        catchError(this.handleError<[]>('getAllWavelengths', []))
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

  getAllIdOfWavelength(name: string, wavelength: number): Observable<WavelengthsOfId[]> {
    const url = `${this.apiUrl}/${name}/columns`;
    const parameters = new HttpParams().set('c', wavelength.toString());

    return this.http.get<WavelengthsOfId[]>(url, { params: parameters })
      .pipe(
        tap(_ => this.log('fetched columns of id', 200)),
        catchError(this.handleError<[]>('getAllIdOfWavelength', []))
      );
  }

  getAllWavelengthsOfId(name: string, id: number): Observable<[]> {
    const url = `${this.apiUrl}/${name}/${id}`;

    return this.http.get<[]>(url)
      .pipe(
        tap(_ => this.log('fetched columns of id', 200)),
        catchError(this.handleError<[]>('getAllIdOfWavelength', []))
      );
  }

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

  private log(messageString: string, httpCode: number): void {
    const message: Message = {
      message: `UploadService: ${messageString}`,
      code: httpCode
    };
    this.messagesService.add(message);
  }
}
