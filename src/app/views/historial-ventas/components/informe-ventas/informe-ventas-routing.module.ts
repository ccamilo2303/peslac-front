import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InformeVentasComponent } from './informe-ventas.component';

const routes: Routes = [
  {
    path: '',
    component: InformeVentasComponent,
    data: {
      title: 'Informe Ventas',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformeVentasRoutingModule {}

