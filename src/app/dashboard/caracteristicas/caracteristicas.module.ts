import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaracteristicasRoutingModule } from './caracteristicas-routing.module';
import { ListaCaracComponent } from './lista-carac/lista-carac.component';
import { CrearCaracComponent } from './crear-carac/crear-carac.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebMaterialModule } from 'app/webmaterial.module';
import { CategoriasRoutingModule } from '../categorias/categorias-routing.module';


@NgModule({
  declarations: [
    ListaCaracComponent,
    CrearCaracComponent
  ],
  imports: [
    CommonModule,
    CaracteristicasRoutingModule,
    CategoriasRoutingModule,
    WebMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent
  ]
})
export class CaracteristicasModule { }
