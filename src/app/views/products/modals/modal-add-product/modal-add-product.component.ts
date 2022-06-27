import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { Product } from '../../response-types/product';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-product',
  templateUrl: './modal-add-product.component.html',
  styleUrls: ['./modal-add-product.component.scss']
})
export class ModalAddProductComponent implements OnInit {

  constructor(private userService: ProductService) { }

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

  }

  @Input()
  public displayStyle: string = '';

  @Input()
  public editUser: any = false;

  @Input()
  public dataUser:Product[] = [];

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.editUser = "false";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {

    console.log(this.form.value);
    console.log('EDITAR USUARIO ' + this.editUser);
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

  }

  initForm() {
    
    if(this.editUser){
      console.log("ENTRA DATOS USUARIO");
      console.log("data modal: " , this.dataUser);
      console.log('EDITAR USUARIO ' + this.editUser);
      this.form.setValue({
        name: this.dataUser[0].name,
       
      });
  
    }
  }

}
