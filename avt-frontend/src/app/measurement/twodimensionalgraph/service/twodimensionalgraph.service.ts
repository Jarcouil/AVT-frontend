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

  /**
   * Get all wavelengths of measurement
   *
   * @param measurementName string
   *
   * @returns Observable<number[]>
   */
  getAllWavelengths(measurementName: string): Observable<number[]> {
    const url = `${this.apiUrl}/columns/${measurementName}`;
    return this.http.get<number[]>(url)
      .pipe(
        // tap(_ => this.log('fetched columns',200)),
        catchError(this.handleError<[]>('getAllWavelengths', []))
      );
  }

  /**
   * Get all ids of measurement
   *
   * @param measurementName string
   *
   * @returns Observable<number[]>
   */
  getAllIds(measurementName: string): Observable<number[]> {
    const url = `${this.apiUrl}/id/${measurementName}`;
    return this.http.get<number[]>(url)
      .pipe(
        // tap(_ => this.log('fetched ids',200)),
        catchError(this.handleError<[]>('getAllIds', []))
      );
  }

  /**
   * Get all ids of given measurment measurementName and wavelength
   *
   * @param measurementName string
   * @param wavelength number
   *
   * @returns Observable<WavelengthsOfId[]>
   */
  getAllIdOfWavelength(measurementName: string, wavelength: number): Observable<WavelengthsOfId[]> {
    const url = `${this.apiUrl}/${measurementName}/columns`;
    const parameters = new HttpParams().set('c', wavelength.toString());

    return this.http.get<WavelengthsOfId[]>(url, { params: parameters })
      .pipe(
        // tap(_ => this.log('fetched columns of id', 200)),
        catchError(this.handleError<[]>('getAllIdOfWavelength', []))
      );
  }

  /**
   * Get all wavelengths of given measurment measurementName and id
   *
   * @param measurementName string
   * @param id number
   *
   * @returns Observable<[]>
   */
  getAllWavelengthsOfId(measurementName: string, id: number): Observable<[]> {
    const url = `${this.apiUrl}/${measurementName}/${id}`;

    return this.http.get<[]>(url)
      .pipe(
        // tap(_ => this.log('fetched columns of id', 200)),
        catchError(this.handleError<[]>('getAllIdOfWavelength', []))
      );
  }

  /**
   * Get all data for 3d graph
   *
   * @param measurementName string
   *
   * @returns Observable<Array<number>>
   */
  getAllData(measurementName: string): Observable<Array<number>>{
    // TODO 3d graph in 2d service
    const url = `${this.apiUrl}/data/${measurementName}`;

    return this.http.get<Array<number>>(url)
      .pipe(
        // tap(_ => this.log('fetched all data', 200)),
        catchError(this.handleError<[]>('getAllData', []))
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
