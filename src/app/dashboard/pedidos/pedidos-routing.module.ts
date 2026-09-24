import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaPedidosComponent } from './tabla-pedidos/tabla-pedidos.component';
import { FormCrearPedidosComponent } from './form-crear-pedidos/form-crear-pedidos.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { RoleGuard } from '@core/guard/role.guard';

const routes: Routes = [
  {
    path: 'listar',
    component: TablaPedidosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador','vendedor','almacen'] }
  },
  {
    path: 'crear',
    component: FormCrearPedidosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['vendedor'] }
  },
  {
    path: 'editar/:id',
    component: FormCrearPedidosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador','vendedor'] }
  },
  {
    path: 'entrega/:id',
    component: TablaPedidosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
