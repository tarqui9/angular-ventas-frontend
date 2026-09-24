import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { IngresosRoutingModule } from './ingresos-routing.module';
import { ListarIngresosComponent } from './listar-ingresos/listar-ingresos.component';
import { CrearIngresosComponent } from './crear-ingresos/crear-ingresos.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CrearIngresosMovilComponent } from './crear-ingresos-movil/crear-ingresos-movil.component';

@NgModule({
  declarations: [
    ListarIngresosComponent,
    CrearIngresosMovilComponent,
    CrearIngresosComponent
  ],
  imports: [
    CommonModule,
    IngresosRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    BreadcrumbComponent,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers:[
    DatePipe
  ]
})
export class IngresosModule { }
