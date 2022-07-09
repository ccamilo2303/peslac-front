import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialComprasComponent } from './historial-compras.component';

import { HistorialComprasRoutingModule } from './historial-ventas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalAnularCompraComponent } from './modals/modal-anular-compra/modal-anular-compra.component';
import { ModalDetalleCompraComponent } from './modals/modal-detalle-compra/modal-detalle-compra.component';
import { ModalDevolucionCompraComponent } from './modals/modal-devolucion-compra/modal-devolucion-compra.component';

@NgModule({
  declarations: [
    HistorialComprasComponent,
    ModalAnularCompraComponent,
    ModalDetalleCompraComponent,
    ModalDevolucionCompraComponent
  ],
  imports: [
    CommonModule,
    HistorialComprasRoutingModule,
    ReactiveFormsModule
  ]
})
export class HistorialComprasModule { }
