import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../response-types/user';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {

  constructor(private userService: UserService) { }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    document_number: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    direction: new FormControl('', [Validators.required]),
    cel_phone: new FormControl('', [Validators.required]),
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    id_type_user: new FormControl('1', [Validators.required]),
  });



  ngOnInit(): void {
    //if(this.editUser){
      this.initForm();
    //}
  }


  @Input()
  public displayStyle: string = '';

  @Input()
  public dataUser:User = new User();

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {

    if(this.dataUser.id == null){
      this.userService.createUser(this.form.value).subscribe(
        {
          complete: () => {
            this.closeModal();
            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso',
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (error: Error) => {
            Swal.fire({
              icon: 'error',
              title: error.message,
              showConfirmButton: false,
            })
          }
        }
      );  

    }else{
      this.userService.editUser(this.form.value).subscribe(
        {
          complete: () => {
            this.closeModal();
            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso',
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (error: Error) => {
            Swal.fire({
              icon: 'error',
              title: error.message,
              showConfirmButton: false,
            })
          }
        }
      );
  
    }

    
    
  }

  initForm() {
    if(this.dataUser.id != null){
      this.form.setValue({
        name: this.dataUser.name,
        last_name: this.dataUser.last_name,
        document_number: this.dataUser.document_number,
        city: this.dataUser.city,
        role: this.dataUser.role,
        email: this.dataUser.email,
        direction: this.dataUser.direction,
        cel_phone: this.dataUser.cel_phone,
        user: this.dataUser.user,
        password: this.dataUser.password,
        id_type_user: this.dataUser.id_type_user,
      });
    }
      
  
    
  }

}
