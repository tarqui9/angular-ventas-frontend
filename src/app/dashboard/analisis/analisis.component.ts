import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { AnalisisService } from './analisis.service';
import { ReporteAnalisis, ConsultaCliente, PedidoGenerado } from './analisis.models';

@Component({
  selector: 'app-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgChartsModule, BreadcrumbComponent, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatTabsModule],
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss'],
})
export class AnalisisComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  vista = 'productos';
  reporte?: ReporteAnalisis;
  cargando = false;
  entrenando = false;
  error = '';
  mensaje = '';
  productoId = 0;
  nivel = '';
  clienteId = 0;
  consultaCliente?: ConsultaCliente;
  consultandoCliente = false;
  errorCliente = '';
  mensajePedido = '';
  preparandoPedido = false;
  guardandoPedido = false;
  pedidoEditado?: number;
  clavePedido = '';
  tipoPagoId = 0;
  observacionPedido = '';
  filasPedido: { suministro_id: number; seleccionado: boolean; cantidad: number }[] = [];
  private consultaActual?: Subscription;
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mensual: ChartData<'line'> = { labels: [], datasets: [] };
  demanda: ChartData<'bar'> = { labels: [], datasets: [] };
  opcionesLinea: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Unidades vendidas' } } },
  };
  opcionesBarras: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Unidades' } } },
  };
  constructor(private api: AnalisisService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.vista = data['vista'] || 'productos';
    });
    this.cargar();
  }
  get titulo() {
    return this.vista === 'clientes' ? 'Clientes y recompra' : this.vista === 'entrenamiento' ? 'Entrenamiento y resultados' : 'Productos y demanda';
  }
  get productos() {
    return (this.reporte?.productos || []).filter(p => !this.productoId || p.id === Number(this.productoId));
  }
  get clientes() {
    return (this.reporte?.clientes || []).filter(c => !this.nivel || c.nivel === this.nivel);
  }
  cargar() {
    this.cargando = true;
    this.error = '';
    this.api.reporte().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.asignar(result); this.cargando = false; },
      error: error => { this.error = String(error?.error?.message || error?.message || error); this.cargando = false; },
    });
  }
  entrenar() {
    if (this.entrenando) return;
    this.entrenando = true;
    this.error = '';
    this.mensaje = '';
    this.api.entrenar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.asignar(result); this.entrenando = false; this.mensaje = 'Entrenamiento terminado. Ya puedes consultar productos y clientes.'; },
      error: error => { this.error = String(error?.error?.message || error?.message || error); this.entrenando = false; },
    });
  }
  private asignar(result: ReporteAnalisis) {
    this.reporte = result;
    this.actualizarGraficos();
    if (this.clienteId) this.consultarCliente();
  }
  consultarCliente() {
    if (this.guardandoPedido) return;
    this.consultaActual?.unsubscribe();
    this.consultaCliente = undefined;
    this.errorCliente = '';
    this.mensajePedido = '';
    this.preparandoPedido = false;
    this.pedidoEditado = undefined;
    if (!this.clienteId) { this.consultandoCliente = false; return; }
    this.consultandoCliente = true;
    this.consultaActual = this.api.cliente(Number(this.clienteId)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.consultaCliente = result; this.consultandoCliente = false; },
      error: error => { this.errorCliente = String(error?.error?.message || error?.message || error); this.consultandoCliente = false; },
    });
  }
  verCliente(id: number) {
    this.clienteId = id;
    this.consultarCliente();
  }
  prepararPedido(order?: PedidoGenerado) {
    const detail = this.consultaCliente;
    if (!detail || this.guardandoPedido) return;
    this.errorCliente = '';
    this.mensajePedido = '';
    this.pedidoEditado = order?.id;
    this.clavePedido = crypto.randomUUID();
    this.tipoPagoId = order ? Number(order.tipo_pago_id) : Number(detail.tipo_pagos[0]?.id || 0);
    this.observacionPedido = order ? order.observacion.replace(/^\[ANALISIS-PREDICTIVO:[^\]]+\] Propuesta predictiva; referencia \d{4}-\d{2}-\d{2}\.\s*/, '') : '';
    let selected = 0;
    this.filasPedido = detail.productos.map(p => {
      const existing = order?.detalle.find(line => line.suministro_id === p.suministro_id);
      const choose = order ? !!existing : !!p.habilitado && p.stock_disponible > 0 && (p.probabilidad_producto ?? 0) >= 50 && selected < 5;
      if (choose) selected++;
      return { suministro_id: p.suministro_id, seleccionado: choose,
        cantidad: existing ? Number(existing.cantidad) : Math.max(1, Math.min(p.cantidad_habitual, p.stock_disponible)) };
    });
    this.preparandoPedido = true;
  }
  stockParaPedido(pid: number): number {
    const available = this.consultaCliente?.productos.find(p => p.suministro_id === pid)?.stock_disponible || 0;
    const own = this.consultaCliente?.pedidos.find(p => p.id === this.pedidoEditado)?.detalle.find(line => line.suministro_id === pid)?.cantidad || 0;
    return Number(available) + Number(own);
  }
  get subtotalPedido() {
    return this.filasPedido.filter(row => row.seleccionado).reduce((sum, row) =>
      sum + row.cantidad * (this.consultaCliente?.productos.find(p => p.suministro_id === row.suministro_id)?.precio || 0), 0);
  }
  get descuentoPedido() {
    return Number(this.consultaCliente?.tipo_pagos.find(p => Number(p.id) === Number(this.tipoPagoId))?.descuento || 0);
  }
  get totalPedido() { return this.subtotalPedido * (1-this.descuentoPedido/100); }
  get pedidoValido() {
    const selected = this.filasPedido.filter(row => row.seleccionado);
    return !!this.tipoPagoId && selected.length > 0 && selected.every(row => {
      const p = this.consultaCliente?.productos.find(product => product.suministro_id === row.suministro_id);
      return p?.habilitado && Number.isInteger(row.cantidad) && row.cantidad >= 1 && row.cantidad <= 100000 && row.cantidad <= this.stockParaPedido(row.suministro_id) && p.precio > 0;
    });
  }
  guardarPedido() {
    if (!this.consultaCliente || this.guardandoPedido || !this.pedidoValido) return;
    this.guardandoPedido = true;
    this.errorCliente = '';
    const cliente = this.consultaCliente.cliente.id;
    this.api.guardarPedido(cliente, {
      clave: this.clavePedido, referencia: this.consultaCliente.referencia,
      tipo_pago_id: Number(this.tipoPagoId), observacion: this.observacionPedido,
      detalle: this.filasPedido.filter(row => row.seleccionado).map(row => ({ suministro_id: row.suministro_id, cantidad: row.cantidad })),
    }, this.pedidoEditado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: saved => {
        this.guardandoPedido = false;
        this.preparandoPedido = false;
        this.consultarCliente();
        this.mensajePedido = `Pedido #${saved.id} guardado como PEDIDO. Puedes editarlo en la lista de pedidos generados.`;
      },
      error: error => { this.errorCliente = String(error?.error?.message || error?.message || error); this.guardandoPedido = false; },
    });
  }
  actualizarGraficos() {
    const rows = this.productos;
    const periods = this.reporte?.mensual.map(m => m.mes) || [];
    this.mensual = {
      labels: periods.map(m => this.meses[Number(m.slice(5, 7)) - 1]),
      datasets: [{ data: periods.map(m => rows.reduce((sum, p) => sum + (p.historial_mensual.find(h => h.mes === m)?.unidades || 0), 0)), label: 'Unidades vendidas', borderColor: '#3f51b5', backgroundColor: 'rgba(63, 81, 181, 0.10)', fill: true, tension: .25 }],
    };
    const top = rows.slice(0, 5);
    this.demanda = {
      labels: top.map(p => p.nombre.length > 32 ? p.nombre.slice(0, 32) + '…' : p.nombre),
      datasets: [
        { label: 'Venta estimada en 30 días', data: top.map(p => p.pronostico_30), backgroundColor: '#3f51b5', borderRadius: 4 },
        { label: 'Stock al cierre', data: top.map(p => p.stock), backgroundColor: '#4caf50', borderRadius: 4 },
      ],
    };
  }
}
