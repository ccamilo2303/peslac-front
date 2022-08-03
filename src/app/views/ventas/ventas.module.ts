import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasComponent } from './ventas.component';
import { VentasRoutingModule } from './ventas-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesModule } from '../clientes/clientes.module';
import { ModalBalanzaComponent } from './modals/modal-balanza/modal-balanza.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';

import {PrintService} from './services/print.service';

@NgModule({
  declarations: [VentasComponent, ModalBalanzaComponent, InvoiceComponent, PrintLayoutComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,  
    ReactiveFormsModule,
    ClientesModule,
    FormsModule,
    
  ],
  providers: [PrintService],
})
export class VentasModule {
}
