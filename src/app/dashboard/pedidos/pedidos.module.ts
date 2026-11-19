import { SugerenciasPedidoComponent } from '../analisis/sugerencias-pedido.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';

import { TablaPedidosComponent } from './tabla-pedidos/tabla-pedidos.component';
import { FormCrearPedidosComponent } from './form-crear-pedidos/form-crear-pedidos.component';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormCrearPedidosMovilComponent } from './form-crear-pedidos-movil/form-crear-pedidos-movil.component';
import { FormCobroPedidoComponent } from './form-cobro-pedido/form-cobro-pedido.component';

@NgModule({
  declarations: [
    TablaPedidosComponent,
    FormCrearPedidosMovilComponent,
    FormCrearPedidosComponent,
    FormCobroPedidoComponent
  ],
  imports: [
    SugerenciasPedidoComponent,
    CommonModule,
    PedidosRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    DatePipe 
  ]
})
export class PedidosModule { }
