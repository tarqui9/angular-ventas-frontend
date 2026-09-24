import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TablaListaDistribuidoresComponent } from './tabla-lista-distribuidores/tabla-lista-distribuidores.component';
import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TablaListaDistribuidoresComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistribuidoresRoutingModule { }
