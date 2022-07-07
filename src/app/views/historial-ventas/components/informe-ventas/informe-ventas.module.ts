import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformeVentasComponent } from './informe-ventas.component';

import { InformeVentasRoutingModule } from './informe-ventas-routing.module';

@NgModule({
  declarations: [
    InformeVentasComponent
  ],
  imports: [
    CommonModule,
    InformeVentasRoutingModule
  ]
})
export class InformeVentasModule { }
