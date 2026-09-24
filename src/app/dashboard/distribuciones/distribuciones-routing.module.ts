import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaListaDistribucionesComponent } from './tabla-lista-distribuciones/tabla-lista-distribuciones.component';
import { FormCrearDistribucionesComponent } from './form-crear-distribuciones/form-crear-distribuciones.component';

import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'listar',
    component: TablaListaDistribucionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'crear',
    component: FormCrearDistribucionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar/:id',
    component: FormCrearDistribucionesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistribucionesRoutingModule { }
