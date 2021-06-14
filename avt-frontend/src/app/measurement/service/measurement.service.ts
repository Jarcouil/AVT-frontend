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
   getAllWavelengths(id: number): Observable<number[]> {
    const url = `${this.apiUrl}/columns/${id}`;
    return this.http.get<number[]>(url)
      .pipe(
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Get all timestamps of measurement
   *
   * @param measurementName string
   *
   * @returns Observable<number[]>
   */
   getAllTimestamps(id: number): Observable<number[]> {
    const url = `${this.apiUrl}/id/${id}`;
    return this.http.get<number[]>(url)
      .pipe(
        catchError(this.handleError<[]>([]))
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
        catchError(this.handleError<[]>([]))
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
      message: `UploadService: ${messageString}`,
      code: httpCode
    };
    this.messagesService.add(message);
  }
}
