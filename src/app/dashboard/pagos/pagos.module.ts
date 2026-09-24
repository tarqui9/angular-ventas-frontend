import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PagosRoutingModule } from './pagos-routing.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TablaPagosComponent } from './tabla-pagos/tabla-pagos.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ListaPagosComponent } from './lista-pagos/lista-pagos.component';


@NgModule({
  declarations: [
    TablaPagosComponent,
    ListaPagosComponent
  ],
  imports: [
    CommonModule,
    PagosRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    DatePipe
  ]
})
export class PagosModule { }
