import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ModalAddProductComponent } from './modals/modal-add-product/modal-add-product.component';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProductComponent, ModalAddProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,  
    ReactiveFormsModule,
    DocsComponentsModule
  ]
})
export class ProductModule {
}
