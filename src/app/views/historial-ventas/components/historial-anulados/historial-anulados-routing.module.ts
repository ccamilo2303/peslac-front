import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistorialAnuladosComponent } from './historial-anulados.component';

const routes: Routes = [
  {
    path: '',
    component: HistorialAnuladosComponent,
    data: {
      title: 'Historial Anulados',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialAnuladosRoutingModule {}

