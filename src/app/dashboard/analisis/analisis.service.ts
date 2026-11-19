import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReporteAnalisis, ConsultaCliente, GuardarPedidoPredictivo } from './analisis.models';

@Injectable({ providedIn: 'root' })
export class AnalisisService {
  constructor(private http: HttpClient) {}
  reporte() { return this.http.get<ReporteAnalisis>('/analisis/reporte'); }
  entrenar() { return this.http.post<ReporteAnalisis>('/analisis/entrenar', {}); }
  cliente(id: number) { return this.http.get<ConsultaCliente>(`/analisis/clientes/${id}`); }
  guardarPedido(cliente: number, body: GuardarPedidoPredictivo, pedido?: number) {
    return pedido
      ? this.http.put<{ id: number; total: number }>(`/analisis/clientes/${cliente}/pedidos/${pedido}`, body)
      : this.http.post<{ id: number; total: number }>(`/analisis/clientes/${cliente}/pedidos`, body);
  }
}
