import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {

  constructor(private userService: UserService) { }

  form:FormGroup = new FormGroup({
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
    

  }

  @Input()
  public displayStyle:string = '';

  @Output()
  public displayStyleEvent = new EventEmitter<string>();


  openModal() {
    this.displayStyle = "block";
    console.log("ENTRA");
  }
  closeModal() {
    this.displayStyle = "none";
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {

    console.log(this.form.value);

    this.userService.createUser(this.form.value).subscribe( 
      {
        complete: () => {

        },
        error: ()=>{
          
        }
      }
    );

    this.userService.createUser(this.form.value).subscribe( res => {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: res,
        showConfirmButton: false,
        timer: 1500
      })

    }, err => {

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.error['message'],
        showConfirmButton: false,
      })

    });



  }

}
