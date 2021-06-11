import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { WavelengthsOfTimestamp } from '../twodimensionalgraph.component';

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
   * Get all timestamps of given measurment measurementName and wavelength
   *
   * @param measurementName string
   * @param wavelength number
   *
   * @returns Observable<WavelengthsOfTimestamp[]>
   */
  getAllTimestampsOfWavelength(measurementName: string, wavelength: number): Observable<WavelengthsOfTimestamp[]> {
    const url = `${this.apiUrl}/${measurementName}/columns`;
    const parameters = new HttpParams().set('c', wavelength.toString());

    return this.http.get<WavelengthsOfTimestamp[]>(url, { params: parameters })
      .pipe(
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Get all wavelengths of given measurment measurementName and timestamp
   *
   * @param measurementName string
   * @param id number
   *
   * @returns Observable<[]>
   */
  getAllWavelengthsOfTimestamp(measurementName: string, id: number): Observable<[]> {
    const url = `${this.apiUrl}/${measurementName}/${id}`;

    return this.http.get<[]>(url)
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
  getAllData(measurementName: string): Observable<Array<number>> {
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
