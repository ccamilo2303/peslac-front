import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProveedoresComponent } from './proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedoresComponent,
    data: {
      title: 'Proveedores',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresRoutingModule {}

