import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialVentasComponent } from './historial-ventas.component';

import { HistorialVentasRoutingModule } from './historial-ventas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDetalleVentaComponent } from './modals/modal-detalle-venta/modal-detalle-venta.component';
import { ModalAnularVentaComponent } from './modals/modal-anular-venta/modal-anular-venta.component';
import { ModalDevolucionComponent } from './modals/modal-devolucion/modal-devolucion.component';

@NgModule({
  declarations: [
    HistorialVentasComponent,
    ModalDetalleVentaComponent,
    ModalAnularVentaComponent,
    ModalDevolucionComponent
  ],
  exports: [
    ModalDetalleVentaComponent
  ],
  imports: [
    CommonModule,
    HistorialVentasRoutingModule,
    ReactiveFormsModule,
  ]
})
export class HistorialVentasModule { }
