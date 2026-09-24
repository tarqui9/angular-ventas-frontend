import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCaracComponent } from './lista-carac/lista-carac.component';
import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ListaCaracComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaracteristicasRoutingModule { }
