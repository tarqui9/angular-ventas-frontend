import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListaTipoPagosComponent } from './lista-tipo-pagos/lista-tipo-pagos.component';
import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ListaTipoPagosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoPagosRoutingModule { }
