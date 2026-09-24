import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';

const routes: Routes = [
  {
    path:'',
    component: ListaUsuariosComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'crear',
    component: CrearUsuariosComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
