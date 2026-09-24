import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPIClass } from '@core/class';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodegaService extends BaseAPIClass {

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
    this.baseUrl = '/bodegas';
   }

  bodega_stock():Observable<any>{
    return this.httpClient.get(this.baseUrl+'/stock')
  }

  bodega_suministro(term):Observable<any>{
    return this.httpClient.get(this.baseUrl+'/suministros?term='+term)
  }
  
  bodegasHabilitados(term): Observable<any> {
    return this.httpClient.get(this.baseUrl+'/habilitados?term='+term);
  }

  getTraspasos(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/traspaso`);
  }

  postTranspasosBodega(payload: any) {
    return this.httpClient.post(`${this.baseUrl}/traspaso`, payload).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

}
