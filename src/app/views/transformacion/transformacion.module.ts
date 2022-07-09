import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransformacionComponent } from './transformacion.component';
import { ModalAgregarTransformacionComponent } from './modals/modal-agregar-transformacion/modal-agregar-transformacion.component';

import { TransformacionRoutingModule } from './transformacion-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TransformacionComponent,
    ModalAgregarTransformacionComponent
  ],
  imports: [
    CommonModule,
    TransformacionRoutingModule,
    ReactiveFormsModule
  ]
})
export class TransformacionModule { }
