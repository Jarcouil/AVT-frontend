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

  /**
   * Get info of file with given id
   *
   * @param measurmentId number
   *
   * @returns Observable<File>
   */
  getDadFileInfo(measurmentId: number): Observable<File> {
    return this.http.get<File>(this.apiUrl + '/file-name/' + measurmentId)
      .pipe(
        catchError(this.handleError<any>())
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
    this.messagesService.clear();
    this.messagesService.add(message);
  }
}

export interface File {
  fileName: string;
}
