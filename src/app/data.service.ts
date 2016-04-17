import {Injectable}   from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}   from 'rxjs/Observable';
import {Story, Task, User} from './models/model';
import 'rxjs/Rx';

@Injectable()
export class DataService {
  readonly BASE_URL = 'http://192.168.99.100:1880';
  constructor (private http: Http) { }

  public getAllStories(): Observable<Story[]> {
    return this.http.get(this.BASE_URL + '/api/stories')
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getAllTasks(): Observable<Task[]> {
    return this.http.get(this.BASE_URL + '/api/tasks')
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get(this.BASE_URL + '/api/users')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || { };
  }
  private handleError (error: any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
