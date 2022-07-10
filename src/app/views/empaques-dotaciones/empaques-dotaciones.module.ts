import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpaquesDotacionesComponent } from './empaques-dotaciones.component';
import { ModalAgregarProductoComponent } from './modals/modal-agregar-producto/modal-agregar-producto.component';

import  { EmpaquesDotacionesRoutingModule } from './empaques-dotaciones-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmpaquesDotacionesComponent,
    ModalAgregarProductoComponent
  ],
  imports: [
    CommonModule,
    EmpaquesDotacionesRoutingModule,
    ReactiveFormsModule
  ]
})
export class EmpaquesDotacionesModule { }
