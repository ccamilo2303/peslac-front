import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialAnuladosComponent } from './historial-anulados.component';

import { HistorialAnuladosRoutingModule } from './historial-anulados-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HistorialVentasModule } from '../../historial-ventas.module';

@NgModule({
  declarations: [
    HistorialAnuladosComponent
  ],
  imports: [
    CommonModule,
    HistorialAnuladosRoutingModule,
    ReactiveFormsModule,
    HistorialVentasModule 
  ]
})
export class HistorialAnuladosModule { }
