import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpaquesDotacionesComponent } from './empaques-dotaciones.component'; 

const routes: Routes = [
  {
    path: '',
    component: EmpaquesDotacionesComponent,
    data: {
      title: 'Empaques y Dotaciones',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpaquesDotacionesRoutingModule {}

