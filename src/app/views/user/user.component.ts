import { Component } from '@angular/core';
import { ModalAddUserComponent } from './modals/modal-add-user/modal-add-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  modalAddUserComponent = new ModalAddUserComponent();

  addUserModal(){
    this.modalAddUserComponent.openModal();
  }

}

