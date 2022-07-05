import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ModalAddProductComponent } from './modals/modal-add-product/modal-add-product.component';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalLineComponent } from './modals/modal-line/modal-line.component';
import { ModalAddLineComponent } from './modals/modal-add-line/modal-add-line.component';
import { ModalAddPackageComponent } from './modals/modal-add-package/modal-add-package.component';
import { ModalPackageComponent } from './modals/modal-package/modal-package.component';
import { ModalPriceListComponent } from './modals/modal-price-list/modal-price-list.component';
import { ModalAddPriceListComponent } from './modals/modal-add-price-list/modal-add-price-list.component';

import { ProveedoresModule } from '../proveedores/proveedores.module';

@NgModule({
  declarations: [ProductComponent, ModalAddProductComponent, ModalLineComponent, ModalAddLineComponent, ModalAddPackageComponent, ModalPackageComponent, ModalPriceListComponent, ModalAddPriceListComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,  
    ReactiveFormsModule,
    DocsComponentsModule,
    ProveedoresModule
  ]
})
export class ProductModule {
}
