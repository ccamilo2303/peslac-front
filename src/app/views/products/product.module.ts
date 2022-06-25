import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ModalAddProductComponent } from './modals/modal-add-product/modal-add-product.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ContextMenuComponent } from './context-menu/context-menu/context-menu.component';


@NgModule({
  declarations: [ProductComponent, ModalAddProductComponent, ContextMenuComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,  
    ReactiveFormsModule
  ]
})
export class ProductModule {
}
