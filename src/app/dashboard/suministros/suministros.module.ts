import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuministrosRoutingModule } from './suministros-routing.module';
import { ListaSuministrosComponent } from './lista-suministros/lista-suministros.component';
import { CrearSuministrosComponent } from './crear-suministros/crear-suministros.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CategoriasModule } from '../categorias/categorias.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UnidadModule } from '../unidad/unidad.module';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { FormBajaSuministroComponent } from './form-baja-suministro/form-baja-suministro.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    ListaSuministrosComponent,
    CrearSuministrosComponent,
    FormBajaSuministroComponent
  ],
  imports: [
    CommonModule,
    SuministrosRoutingModule,
    WebMaterialModule,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    UnidadModule,
    CategoriasModule,
    FileUploadComponent,
    NgxMatSelectSearchModule,
    FormsModule
  ],
  exports:[

  ]
})
export class SuministrosModule { }
