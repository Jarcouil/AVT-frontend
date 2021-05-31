import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        // tap(_ => this.log('fetched users', 200)),
        catchError(this.handleError<User[]>('getUsers', []))
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
    return this.http.get<User>(this.apiUrl + '/' + id)
      .pipe(
        // tap(_ => this.log('fetched user', 200)),
        catchError(this.handleError<User>('getUser'))
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
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError('deleteUser'))
      );
  }

  toggleAdmin(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.post<any>(url, {id})
      .pipe(
        catchError(this.handleError('toggleAdmin'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
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
      message: `UserService: ${messageString}`,
      code: httpCode
    };

    this.messagesService.add(message);
  }
}
