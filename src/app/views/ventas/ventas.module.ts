import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasComponent } from './ventas.component';
import { VentasRoutingModule } from './ventas-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ClientesModule } from '../clientes/clientes.module';
import { ModalBalanzaComponent } from './modals/modal-balanza/modal-balanza.component';


@NgModule({
  declarations: [VentasComponent, ModalBalanzaComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,  
    ReactiveFormsModule,
    ClientesModule
    
  ]
})
export class VentasModule {
}
