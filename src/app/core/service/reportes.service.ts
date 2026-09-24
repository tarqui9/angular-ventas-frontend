import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIClass } from '../class/baseAPI.class';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportesService extends BaseAPIClass {

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
    this.baseUrl = '/reportes';
  }

  getReporteDistribuciones(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/distribucion?rol_id=${rol_id}&user_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
  }

  reporteDistribucionesPdf(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/distribucion-pdf?rol_id=${rol_id}&user_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { responseType: 'blob' })
  }

  getReporteStockProductos(filter: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/stock?filter=${filter}`);
  }

  reporteStockProductosPdf(filter: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/stock-pdf?filter=${filter}`, { responseType: 'blob' })
  }

  reporteDetalleVentaProductoPdf(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/detalle/${id}`, { responseType: 'blob' })
  }
  
  getReporteUtilidad(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/utilidad`);
  }

  reporteUtilidadPdf(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/utilidad-pdf`, { responseType: 'blob' })
  }

  getReporteCreditos(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/creditos?rol_id=${rol_id}&vendedor_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
  }

  reporteCreditosPdf(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/creditos-pdf?rol_id=${rol_id}&vendedor_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { responseType: 'blob' })
  }

  getReporteVentas(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/ventas?rol_id=${rol_id}&vendedor_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
  }

  reporteVentasPdf(rol_id: any, user_id: any, fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/ventas-pdf?rol_id=${rol_id}&vendedor_id=${user_id}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { responseType: 'blob' })
  }

  getReporteVentaProdutos(rol_id: any, user_id: any, mes: any, year: any): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/ventaproductos?rol_id=${rol_id}&vendedor_id=${user_id}&mes=${mes}&year=${year}`);
  }

  reporteVentaProdutosPdf(rol_id: any, user_id: any, mes: any, year: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/ventaproductos-pdf?rol_id=${rol_id}&vendedor_id=${user_id}&mes=${mes}&year=${year}`, { responseType: 'blob' })
  }

  getReporteGestiones(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/gestiones`);
  }
}

