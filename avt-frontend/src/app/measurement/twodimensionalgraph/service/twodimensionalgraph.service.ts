import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { WavelengthsOfTimestamp } from '../twodimensionalgraph.component';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TwodimensionalgraphService {
  private apiUrl = `${environment.apiUrl}/measurement`;

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }

  /**
   * Get all timestamps of given measurment id and wavelength
   *
   * @param id number
   * @param wavelength number
   *
   * @returns Observable<WavelengthsOfTimestamp[]>
   */
  getTimestampsOfWavelength(id: number, wavelength: number): Observable<WavelengthsOfTimestamp[]> {
    const url = `${this.apiUrl}/${id}/timestamps`;
    const parameters = new HttpParams().set('wavelength', wavelength.toString());

    return this.http.get<WavelengthsOfTimestamp[]>(url, { params: parameters })
      .pipe(
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Get all wavelengths of given measurment id and timestamp
   *
   * @param id number
   * @param id number
   *
   * @returns Observable<[]>
   */
  getWavelengthsOfTimestamp(id: number, timestamps: number[]): Observable<[]> {
    const url = `${this.apiUrl}/${id}/wavelengths`;
    const parameters = new HttpParams().set(
      'timestamps', JSON.stringify(timestamps.map(timestamp => timestamp.toString()))
    );

    return this.http.get<[]>(url, { params: parameters })
      .pipe(
        catchError(this.handleError<[]>([]))
      );
  }

  /**
   * Get all data for 3d graph
   *
   * @param measurement id number
   *
   * @returns Observable<Array<number>>
   */
   getData(id: number, xMin: number, xMax: number, yMin: number, yMax: number): Observable<Array<number>>{
    const url = `${this.apiUrl}/data/${id}`;
    const parameters = new HttpParams()
      .set('xMin', xMin.toString())
      .set('xMax', xMax.toString())
      .set('yMin', yMin.toString())
      .set('yMax', yMax.toString());

    return this.http.get<Array<number>>(url, { params: parameters })
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
