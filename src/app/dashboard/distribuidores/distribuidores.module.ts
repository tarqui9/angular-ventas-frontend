import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistribuidoresRoutingModule } from './distribuidores-routing.module';

import { TablaListaDistribuidoresComponent } from './tabla-lista-distribuidores/tabla-lista-distribuidores.component';
import { FormCrearDistribuidorComponent } from './form-crear-distribuidor/form-crear-distribuidor.component';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TablaListaDistribuidoresComponent,
    FormCrearDistribuidorComponent
  ],
  imports: [
    CommonModule,
    DistribuidoresRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DistribuidoresModule { }
