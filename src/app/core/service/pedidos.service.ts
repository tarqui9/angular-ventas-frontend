import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BaseAPIClass } from '../class/baseAPI.class';

@Injectable({
    providedIn: 'root'
})
export class PedidosService extends BaseAPIClass {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
        this.baseUrl = '/pedidos';
    }

    deleteDetalle(id: any): Observable<any> {
        return this.httpClient.delete(this.baseUrl + '/detalles/' + id)
    }

    pdfPedido(id: any): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/pdf/${id}`, {
            responseType: 'blob'
        });
    }

    getPedidosDistribucion(id: any) : Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl}?estado=PEDIDO&agrupar=1&rol_id=${id}`).pipe(
            map((body: any) => {
                return body;
            })
        );
    }
}

