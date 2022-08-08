import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasComponent } from './compras.component';
import { ComprasRoutingModule } from './compras-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesModule } from '../clientes/clientes.module';
import { ModalBalanzaComponent } from './modals/modal-balanza/modal-balanza.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';

import {PrintService} from './services/print.service';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [ComprasComponent, ModalBalanzaComponent, InvoiceComponent, PrintLayoutComponent],
  imports: [
    CommonModule,
    ComprasRoutingModule,  
    ReactiveFormsModule,
    ClientesModule,
    FormsModule,
    NgxPrintModule
  ],
  providers: [PrintService],
})
export class ComprasModule {
}
