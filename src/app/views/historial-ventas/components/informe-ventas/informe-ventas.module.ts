import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { InformeVentasComponent } from './informe-ventas.component';

import { InformeVentasRoutingModule } from './informe-ventas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InformeVentasComponent
  ],
  imports: [
    CommonModule,
    InformeVentasRoutingModule,
    ReactiveFormsModule,
    ChartjsModule
  ]
})
export class InformeVentasModule { }
