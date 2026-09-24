import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { CrearClientesComponent } from './crear-clientes/crear-clientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';


@NgModule({
  declarations: [
    ListaClientesComponent,
    CrearClientesComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    NgClass,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent
  ]
})
export class ClientesModule { }
