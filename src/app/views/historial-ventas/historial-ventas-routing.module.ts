import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistorialVentasComponent } from './historial-ventas.component'; 

const routes: Routes = [
  {
    path: '',
    component: HistorialVentasComponent,
    data: {
      title: 'Historial Ventas',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialVentasRoutingModule {}

