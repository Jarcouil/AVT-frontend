import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { Measurement } from '../../measurement-overview/measurement';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private measurementSubject = new ReplaySubject<Measurement>();
  private apiUrl = 'http://localhost:3000/v1/measurement';

  measurement$ = this.measurementSubject.asObservable();

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  /**
   * Set measurement
   *
   * @param measurement Measurement
   *
   * @returns void
   */
  setMeasurement(measurement: Measurement): void{
    this.measurementSubject.next(measurement);
  }

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
   * Get all data for 3d graph
   *
   * @param measurementName string
   *
   * @returns Observable<Array<number>>
   */
   getAllData(measurementName: string): Observable<Array<number>>{
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
