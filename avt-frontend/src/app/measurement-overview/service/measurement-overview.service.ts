import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, MessagesService } from 'src/app/shared/messages/messages.service';
import { Measurement } from '../measurement';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeasurementOverviewService {
  private apiUrl = 'http://localhost:3000/v1/measurement';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService) { }

  /**
   * Get all the measurments
   *
   * @returns Observable<Measurement[]>
   */
  getAllMeasurementsOfUser(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(this.apiUrl)
      .pipe(
        // tap(_ => this.log('fetched measurements', 200)),
        catchError(this.handleError<Measurement[]>('getMeasurements', []))
      );
  }

  /**
   * Get all the measurments
   *
   * @returns Observable<Measurement[]>
   */
   getAllMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(this.apiUrl + '/all')
      .pipe(
        // tap(_ => this.log('fetched measurements', 200)),
        catchError(this.handleError<Measurement[]>('getMeasurements', []))
      );
  }

  /**
   * Get measurement of given id
   *
   * @param id number
   *
   * @returns Observable<Measurement>
   */
  getMeasurement(id: number): Observable<Measurement> {
    return this.http.get<Measurement>(this.apiUrl + '/' + id)
      .pipe(
        // tap(_ => this.log('fetched measurement', 200)),
        catchError(this.handleError<Measurement>())
      );
  }

  /**
   * Delete measurement of given id
   *
   * @param id number
   *
   * @returns Observable<any>
   */
  deleteMeasurement(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError('deleteMeasurement'))
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

    this.messagesService.add(message);
  }

}
