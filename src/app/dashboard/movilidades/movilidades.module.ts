import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovilidadesRoutingModule } from './movilidades-routing.module';

import { TablaListaMovilidadesComponent } from './tabla-lista-movilidades/tabla-lista-movilidades.component';
import { FormCrearMovilidadesComponent } from './form-crear-movilidades/form-crear-movilidades.component';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    TablaListaMovilidadesComponent,
    FormCrearMovilidadesComponent
  ],
  imports: [
    CommonModule,
    MovilidadesRoutingModule,
    BreadcrumbComponent,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadComponent
  ]
})
export class MovilidadesModule { }
