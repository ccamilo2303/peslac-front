import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresRoutingModule } from './proveedores-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalAgregarProveedoresComponent } from './modals/modal-agregar-proveedores/modal-agregar-proveedores.component';



@NgModule({
  declarations: [ProveedoresComponent, ModalAgregarProveedoresComponent],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,  
    ReactiveFormsModule
  ]
})
export class ProveedoresModule {
}
