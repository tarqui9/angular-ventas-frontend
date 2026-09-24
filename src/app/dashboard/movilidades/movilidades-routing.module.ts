import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaListaMovilidadesComponent } from './tabla-lista-movilidades/tabla-lista-movilidades.component';
import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TablaListaMovilidadesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovilidadesRoutingModule { }
