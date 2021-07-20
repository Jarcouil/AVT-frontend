import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private apiUrl = `${environment.apiUrl}/file`;

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) {}

  /**
   * Download file of measurment and name
   *
   * @param measurmentId 
   * @param file
   * @returns Observable<Blob> 
   */
  downloadFile(measurmentId: number, file: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/download-file/${measurmentId}/${file}`, {
        responseType: 'blob',
      })
      .pipe(catchError(this.handleBlobError<any>()));
  }

  /**
   * Get CSV file of given timestamps and wavelenths
   *
   * @param measurmentId id
   * @param timestamps number[]
   * @param wavelengths number[]
   * @returns Observable<Blob> file
   */
  getCSV(measurmentId: number, wavelengths: number[], minTimestamp: number, maxTimestamp: number): Observable<Blob> {
    let parameters = new HttpParams()
      .set('minTimestamp', minTimestamp.toString())
      .set('maxTimestamp', maxTimestamp.toString())
      .set('wavelengths', JSON.stringify(wavelengths.map((wavelength) => wavelength.toString())));

    return this.http.get(`${this.apiUrl}/csv/${measurmentId}`, {
        params: parameters,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleBlobError<any>()));
  }

  /**
   * Get CSV file of given timestamps and wavelenths
   *
   * @param measurmentId id
   * @param timestamps number[]
   * @param wavelengths number[]
   * @returns Observable<Blob> file
   */
  getCSVRange(measurmentId: number, exportForm: FormData): Observable<Blob> {
    let parameters = new HttpParams();
    parameters = parameters.append('minWavelength', exportForm.get('minWaveLength')?.toString() || '');
    parameters = parameters.append('maxWavelength', exportForm.get('maxWaveLength')?.toString() || '');
    parameters = parameters.append('minTimestamp', exportForm.get('minTimestamp')?.toString() || '');
    parameters = parameters.append('maxTimestamp', exportForm.get('maxTimestamp')?.toString() || '');

    return this.http
      .get(`${this.apiUrl}/csv/${measurmentId}`, {
        params: parameters,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleBlobError<any>()));
  }

  /**
   * Get info of files with given id
   *
   * @param measurmentId number
   *
   * @returns Observable<File>
   */
  getFileInfo(measurmentId: number): Observable<Files> {
    return this.http
      .get<File>(`${this.apiUrl}/file-names/${measurmentId}`)
      .pipe(catchError(this.handleError<any>()));
  }

  /**
   * handle error when response type is Blob
   *
   * @param result T
   * @returns any
   */
   private handleBlobError<T>(result?: T): any {
    return async (error: any): Promise<Observable<T>> => {
      console.error(error); // log to console
      const message = JSON.parse(await error.error.text()).message;
      this.log(`${message}`, 400);
      return of(result as T);
    };
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
      code: httpCode,
    };
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}

export interface Files {
  fileNames: string[];
}
