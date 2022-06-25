import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { ModalAddUserComponent } from './modals/modal-add-user/modal-add-user.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ContextMenuComponent } from './context-menu/context-menu/context-menu.component';


@NgModule({
  declarations: [UserComponent, ModalAddUserComponent, ContextMenuComponent],
  imports: [
    CommonModule,
    UserRoutingModule,  
    ReactiveFormsModule
  ]
})
export class UserModule {
}
