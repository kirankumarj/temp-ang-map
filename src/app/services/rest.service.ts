import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(public http: HttpClient) {}

  public findAll<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  public findOne<T>(id: any, url: string): Observable<T> {
    return this.http.get<T>(url + id);
  }

  public post<T>(postObj: any, url: string): Observable<T> {
    return this.http.post<T>(url, postObj);
  }

  public update<T>(itemToUpdate: any, url: string): Observable<T> {
    return this.http.put<T>(url, itemToUpdate);
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
