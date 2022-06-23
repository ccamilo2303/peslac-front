import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { ModalAddUserComponent } from './modals/modal-add-user/modal-add-user.component';

@NgModule({
  declarations: [UserComponent, ModalAddUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
  ]
})
export class UserModule {
}
