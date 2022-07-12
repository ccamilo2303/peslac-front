import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesComponent } from './clientes.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ProductModule } from '../products/product.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAgregarClientesComponent } from './modals/modal-agregar-clientes/modal-agregar-clientes.component';



@NgModule({
  declarations: [ClientesComponent, ModalAgregarClientesComponent],
  imports: [
    CommonModule,
    ClientesRoutingModule,  
    ReactiveFormsModule,
    ProductModule
  ],
  exports: [
    ModalAgregarClientesComponent
  ]
})
export class ClientesModule {
}
