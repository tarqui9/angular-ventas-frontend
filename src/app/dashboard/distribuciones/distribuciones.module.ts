import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistribucionesRoutingModule } from './distribuciones-routing.module';

import { TablaListaDistribucionesComponent } from './tabla-lista-distribuciones/tabla-lista-distribuciones.component';
import { FormCrearDistribucionesComponent } from './form-crear-distribuciones/form-crear-distribuciones.component';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TablaListaDistribucionesComponent,
    FormCrearDistribucionesComponent
  ],
  imports: [
    CommonModule,
    DistribucionesRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DistribucionesModule { }
