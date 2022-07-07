import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialVentasComponent } from './historial-ventas.component';

import { HistorialVentasRoutingModule } from './historial-ventas-routing.module';

@NgModule({
  declarations: [
    HistorialVentasComponent
  ],
  imports: [
    CommonModule,
    HistorialVentasRoutingModule
  ]
})
export class HistorialVentasModule { }
