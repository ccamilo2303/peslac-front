import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistorialComprasComponent } from './historial-compras.component'; 

const routes: Routes = [
  {
    path: '',
    component: HistorialComprasComponent,
    data: {
      title: 'Historial Compras',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialComprasRoutingModule {}

