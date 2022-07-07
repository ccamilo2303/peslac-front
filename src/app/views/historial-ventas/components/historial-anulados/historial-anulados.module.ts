import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialAnuladosComponent } from './historial-anulados.component';

import { HistorialAnuladosRoutingModule } from './historial-anulados-routing.module';


@NgModule({
  declarations: [
    HistorialAnuladosComponent
  ],
  imports: [
    CommonModule,
    HistorialAnuladosRoutingModule
  ]
})
export class HistorialAnuladosModule { }
