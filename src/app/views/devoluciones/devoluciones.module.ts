import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevolucionesComponent } from './devoluciones.component';
import { ModalDetalleDevolucionComponent } from './modals/modal-detalle-devolucion/modal-detalle-devolucion.component';

import { DevolucionesRoutingModule } from './devoluciones-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DevolucionesComponent,
    ModalDetalleDevolucionComponent
  ],
  imports: [
    CommonModule,
    DevolucionesRoutingModule,
    ReactiveFormsModule
  ]
})
export class DevolucionesModule { }
