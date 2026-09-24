import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaPagosComponent } from './tabla-pagos/tabla-pagos.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { RoleGuard } from '@core/guard/role.guard';
import { ListaPagosComponent } from './lista-pagos/lista-pagos.component';

const routes: Routes = [
  {
    path: 'listar',
    component: TablaPagosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['vendedor','distribuidor'] }
  },
  {
    path: 'listado',
    component: ListaPagosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
