import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { AnalisisService } from './analisis.service';
import { ConsultaCliente, ProductoCliente } from './analisis.models';

@Component({
  selector: 'app-sugerencias-pedido', standalone: true, imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <aside class="card suggestions">
      <div class="header suggestions-heading">
        <h2><strong>Sugerencias</strong> para este cliente<small>Productos habituales y propuesta para su próximo pedido.</small></h2>
        <button type="button" mat-raised-button color="primary" (click)="consultar()" [disabled]="!clienteId || cargando || deshabilitado"><mat-icon>lightbulb_outline</mat-icon> {{ cargando ? 'Consultando…' : 'Ver sugerencias' }}</button>
      </div>
      <div class="body">
      <small *ngIf="!clienteId">Selecciona primero un cliente.</small>
      <p class="alert alert-danger" role="alert" *ngIf="error">{{ error }}</p>
      <ng-container *ngIf="consulta as d">
        <div class="summary"><strong>{{ d.cliente.razon_social }}</strong><span *ngIf="d.analisis.estimacion_disponible"> · Próxima compra estimada en {{ d.analisis.proxima_compra_dias }} días ({{ d.analisis.proxima_compra_fecha | date:'dd/MM/yyyy' }}), desde {{ d.referencia }}.</span><span *ngIf="!d.analisis.estimacion_disponible"> · Sin fecha estimada.</span></div>
        <p *ngIf="d.mensaje" class="alert alert-info">{{ d.mensaje }}</p>
        <div class="table-responsive suggestions-table" *ngIf="d.productos.length"><table class="table table-striped table-hover w-100"><thead><tr><th>Producto</th><th>Probabilidad en próximo pedido</th><th>Cantidad habitual</th><th>Disponible</th><th></th></tr></thead><tbody><tr *ngFor="let p of d.productos"><td>{{ p.nombre }}</td><td>{{ p.probabilidad_producto === null ? 'Sin predicción' : (p.probabilidad_producto | number:'1.0-1') + '%' }}</td><td>{{ p.cantidad_habitual }} unidades</td><td>{{ p.stock_disponible }}</td><td><button type="button" mat-stroked-button color="primary" (click)="agregar.emit(p)" [disabled]="deshabilitado || !p.habilitado || p.stock_disponible < 1 || incluidos.includes(p.suministro_id)">{{ incluidos.includes(p.suministro_id) ? 'Ya incluido' : 'Añadir al pedido' }}</button></td></tr></tbody></table></div>
        <small *ngIf="d.productos.length">El porcentaje estima que incluya el producto si vuelve dentro de 30 días; no es una garantía. La cantidad es la mediana de sus tres compras recientes. Puedes cambiarla en el detalle del pedido. Precios y disponibilidad se verifican al guardar.</small>
        <div class="actions" *ngIf="d.productos.length"><button type="button" mat-raised-button color="primary" (click)="agregarProbables()" [disabled]="deshabilitado || !hayProbables">Añadir productos más probables</button><button type="button" mat-button (click)="consulta = undefined">Cerrar</button></div>
      </ng-container>
      </div>
    </aside>`,
  styles: [`
    .suggestions { margin-top: 20px; margin-bottom: 0; }
    .suggestions-heading { align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .summary { margin-bottom: 12px; }
    .suggestions-table { max-height: 340px; margin-bottom: 12px; }
    .body > small { display: block; margin-top: 6px; line-height: 1.6; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
    @media (max-width: 575px) { .suggestions-heading { align-items: stretch; flex-direction: column; } }
  `],
})
export class SugerenciasPedidoComponent implements OnChanges {
  @Input() clienteId: number | null = null;
  @Input() deshabilitado = false;
  @Input() incluidos: number[] = [];
  @Output() agregar = new EventEmitter<ProductoCliente>();
  consulta?: ConsultaCliente;
  cargando = false;
  error = '';
  private actual?: Subscription;
  private destroyRef = inject(DestroyRef);
  constructor(private api: AnalisisService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['clienteId']) {
      this.actual?.unsubscribe(); this.cargando = false; this.consulta = undefined; this.error = '';
    }
    if (this.consulta && this.consulta.cliente.id !== Number(this.clienteId)) this.consulta = undefined;
    // No cancelar la consulta cuando solo cambian los productos incluidos.
    if (!this.clienteId) { this.actual?.unsubscribe(); this.cargando = false; this.consulta = undefined; }
  }
  consultar() {
    if (!this.clienteId || this.cargando || this.deshabilitado) return;
    this.actual?.unsubscribe();
    const id = Number(this.clienteId);
    this.cargando = true;
    this.error = '';
    this.actual = this.api.cliente(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { if (Number(this.clienteId) === id) this.consulta = result; this.cargando = false; },
      error: error => { this.error = String(error?.error?.message || error?.message || error); this.cargando = false; },
    });
  }
  get probables() { return (this.consulta?.productos || []).filter(p => p.habilitado && p.stock_disponible > 0 && (p.probabilidad_producto ?? 0) >= 50 && !this.incluidos.includes(p.suministro_id)).slice(0,5); }
  get hayProbables() { return this.probables.length > 0; }
  agregarProbables() { for (const p of this.probables) this.agregar.emit(p); }
}
