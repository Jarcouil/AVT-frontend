import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/account/user';
import { MessagesService, Message } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class UsersOverviewService {

  private apiUrl = 'http://localhost:3000/v1/users';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService) { }

  /**
   * Get all the measurments
   *
   * @returns Observable<User[]>
   */
  getAllUsers(sort: string, order: string): Observable<User[]> {
    const parameters = new HttpParams().set('sort', sort).set('order', order);

    return this.http.get<User[]>(this.apiUrl, {params: parameters})
      .pipe(
        catchError(this.handleError<User[]>([]))
      );
  }

  /**
   * Get user of given id
   *
   * @param id number
   *
   * @returns Observable<User>
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<User>())
      );
  }

  /**
   * Delete user of given id
   *
   * @param id number
   *
   * @returns Observable<any>
   */
  deleteUser(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError('deleteUser'))
      );
  }

  /**
   * Toogle admin rights for user of given id
   *
   * @param id userId
   * @returns Observable<any>
   */
  toggleAdmin(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.post<any>(url, {id}, {observe: 'response'})
      .pipe(
        tap(response => this.log(response.body.message, response.status)),
        catchError(this.handleError())
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
      console.error(error); // log to console instead
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
