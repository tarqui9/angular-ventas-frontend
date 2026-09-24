import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPIClass } from '../class/baseAPI.class';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgrupadosService extends BaseAPIClass {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
        this.baseUrl = '/agrupados';
    }

    getAgrupadosAll(user_id: any, rol_id: any = ''): Observable<any> {
        return this.httpClient.get<any>(`${this.baseUrl}?user_id=${user_id}&rol_id=${rol_id}`).pipe(
            map((body: any) => {
                return body;
            })
        );
    }

    pdfPedidosAgrupados(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/pdf/${id}`, {
            responseType: 'blob'
        });
    }

    getDespacharPedido(id: any) : Observable<any> {
        return this.httpClient.get<any>(`${this.baseUrl}/despachar/${id}`);
    }
    quitarDetalle(id: any): Observable<any> {
        return this.httpClient.delete(this.baseUrl + '/quitar/' + id)
    }
    devolverPedido(id: any): Observable<any> {
        return this.httpClient.get(this.baseUrl + '/devolver/' + id)
    }
    entregarPedido(id: any): Observable<any> {
        return this.httpClient.get(this.baseUrl + '/entrega/' + id)
    }
}

