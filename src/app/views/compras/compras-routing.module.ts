import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComprasComponent } from './compras.component';

import {InvoiceComponent} from './invoice/invoice.component';
import {PrintLayoutComponent} from './print-layout/print-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ComprasComponent,
    data: {
      title: 'Compras',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule { }

