import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioComponent } from './inventario.component';
import { InventarioRoutingModule } from './inventario-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalAgregarClientesComponent } from './modals/modal-agregar-clientes/modal-agregar-clientes.component';
import { ModalAgregarSalidaComponent } from './modals/modal-agregar-salida/modal-agregar-salida.component';
import { ModalAgregarDevolucionComponent } from './modals/modal-agregar-devolucion/modal-agregar-devolucion.component';

@NgModule({
  declarations: [
    InventarioComponent,
    ModalAgregarClientesComponent,
    ModalAgregarSalidaComponent,
    ModalAgregarDevolucionComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,  
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
