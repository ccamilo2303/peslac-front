import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransformacionComponent } from './transformacion.component';

const routes: Routes = [
  {
    path: '',
    component: TransformacionComponent,
    data: {
      title: 'Transformación',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransformacionRoutingModule {}

