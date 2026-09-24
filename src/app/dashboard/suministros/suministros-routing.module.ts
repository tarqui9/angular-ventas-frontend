import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaSuministrosComponent } from './lista-suministros/lista-suministros.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { CrearSuministrosComponent } from './crear-suministros/crear-suministros.component';

const routes: Routes = [
  {
    path:'',
    component: ListaSuministrosComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'crear',
    component: CrearSuministrosComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'editar/:id',
    component: CrearSuministrosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuministrosRoutingModule { }
