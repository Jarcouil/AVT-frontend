import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, MessagesService } from 'src/app/shared/messages/messages.service';
import { Measurement } from '../measurement';
import { MeasurementResponse } from '../measurement';
import { catchError } from 'rxjs/operators';

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
   * @returns Observable<MeasurementResponse>
   */
  getAllMeasurementsOfUser(sort: string, order: string, page: number, perPage: number): Observable<MeasurementResponse> {
    const parameters = new HttpParams()
      .set('sort', sort)
      .set('order', order)
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<MeasurementResponse>(this.apiUrl, {params: parameters})
      .pipe(
        catchError(this.handleError<MeasurementResponse>())
      );
  }

  /**
   * Get all the measurments
   *
   * @returns Observable<MeasurementResponse>
   */
  getAllMeasurements(sort: string, order: string, page: number, perPage: number): Observable<MeasurementResponse> {
    const parameters = new HttpParams()
      .set('sort', sort)
      .set('order', order)
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<MeasurementResponse>(`${this.apiUrl}/all`, {params: parameters})
      .pipe(
        catchError(this.handleError<MeasurementResponse>())
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
    return this.http.get<Measurement>(`${this.apiUrl}/${id}`)
      .pipe(
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

  /**
   * handle error
   *
   * @param result T
   * @returns any
   */
  private handleError<T>(result?: T): any {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      this.log(`${error.error.message}`, 400);
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

    this.messagesService.add(message);
  }

}
