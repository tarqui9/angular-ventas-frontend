import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';

import { ReporteDistribucionesComponent } from './reporte-distribuciones/reporte-distribuciones.component';
import { ReporteStockProductosComponent } from './reporte-stock-productos/reporte-stock-productos.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteCreditosComponent } from './reporte-creditos/reporte-creditos.component';
import { ReporteVentaProductosComponent } from './reporte-venta-productos/reporte-venta-productos.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReporteUtilComponent } from './reporte-util/reporte-util.component';

@NgModule({
  declarations: [
    ReporteDistribucionesComponent,
    ReporteCreditosComponent,
    ReporteVentaProductosComponent,
    ReporteVentasComponent,
    ReporteUtilComponent,
    ReporteStockProductosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    ReportesRoutingModule,
    WebMaterialModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    DatePipe
  ]
})
export class ReportesModule { }
