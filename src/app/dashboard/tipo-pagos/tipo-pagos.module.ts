import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoPagosRoutingModule } from './tipo-pagos-routing.module';

import { ListaTipoPagosComponent } from './lista-tipo-pagos/lista-tipo-pagos.component';
import { CrearTipoPagosComponent } from './crear-tipo-pagos/crear-tipo-pagos.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListaTipoPagosComponent,
    CrearTipoPagosComponent
  ],
  imports: [
    CommonModule,
    TipoPagosRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TipoPagosModule { }
