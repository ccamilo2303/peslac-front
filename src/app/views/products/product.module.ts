import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ModalAddProductComponent } from './modals/modal-add-product/modal-add-product.component';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalGroupComponent } from './modals/modal-group/modal-group.component';
import { ModalAddGroupComponent } from './modals/modal-add-group/modal-add-group.component';
import { ModalDiscountComponent } from './modals/modal-discount/modal-discount.component';
import { ModalAddDiscountComponent } from './modals/modal-add-discount/modal-add-discount.component';



@NgModule({
  declarations: [ProductComponent, ModalAddProductComponent, ModalGroupComponent, ModalAddGroupComponent, ModalDiscountComponent, ModalAddDiscountComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,  
    ReactiveFormsModule,
    DocsComponentsModule
  ]
})
export class ProductModule {
}
