import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteDistribucionesComponent } from './reporte-distribuciones/reporte-distribuciones.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { RoleGuard } from '@core/guard/role.guard';
import { ReporteStockProductosComponent } from './reporte-stock-productos/reporte-stock-productos.component';
import { ReporteCreditosComponent } from './reporte-creditos/reporte-creditos.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReporteVentaProductosComponent } from './reporte-venta-productos/reporte-venta-productos.component';
import { ReporteUtilComponent } from './reporte-util/reporte-util.component';

const routes: Routes = [
  {
    path: 'distribuciones',
    component: ReporteDistribucionesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'almacen', 'distribuidor'] }
  },
  {
    path: 'creditos',
    component: ReporteCreditosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'ventas',
    component: ReporteVentasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'venta-productos',
    component: ReporteVentaProductosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  },
  {
    path: 'inventario',
    component: ReporteUtilComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'stock-productos',
    component: ReporteStockProductosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'almacen'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
