import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseAPIClass } from '../class/baseAPI.class';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseAPIClass {

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
    this.baseUrl = '/users';
  }
  cambiarContrasenia(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/change-password', data);
  }

  getAllRoles(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/roles')
  }

  getBossList(filterObject?: any): Observable<any> {
    let queryString = '';
    if (filterObject) {
      const fitlerKeys: any[] = Object.keys(filterObject);
      if (fitlerKeys.length > 0) {
        queryString = '?';
      }
      fitlerKeys.forEach((key: any, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${key}=${filterObject[key]}&`;
          }
        }
      });
      if (
        fitlerKeys.length > 0 &&
        queryString[queryString.length - 1] === '&'
      ) {
        queryString = queryString.slice(0, -1);
      }
      
    }
    return this.httpClient.get(`${this.baseUrl}/jefes${queryString}`).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  public getAllDistribuidores() : Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/distribuidores`);
  }

  public getAllVendedores() : Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/vendedores`);
  }

  public postAsignarDistribuidor(data: any) {
    return this.httpClient.post(`${this.baseUrl}/movilidades`, data).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

}

