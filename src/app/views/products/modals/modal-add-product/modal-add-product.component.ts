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
    quantity: new FormControl('', [Validators.required]),
    type_product: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    iva: new FormControl('', [Validators.required]),
    supplier: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    image_url: new FormControl('', [Validators.required]),
    state_product: new FormControl('', [Validators.required]),
    inventary_min: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
  });



  ngOnInit(): void {
    this.initForm();
  }

  @Input()
  public displayStyle: string = '';

  @Input()
  public dataUser: Product = new Product();

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {
    if (this.dataUser.id == null) {
      this.userService.createProduct(this.form.value).subscribe(
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
      this.userService.editProduct(this.form.value).subscribe(
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

    if (this.dataUser.id != null) {
      this.form.setValue({
        name: this.dataUser.name,
        quantity: this.dataUser.quantity,
        type_product: this.dataUser.type_product,
        price: this.dataUser.price,
        iva: this.dataUser.iva,
        supplier: this.dataUser.supplier,
        description: this.dataUser.description,
        type: this.dataUser.type,
        image_url: this.dataUser.image_url,
        state_product: this.dataUser.state_product,
        inventary_min: this.dataUser.inventary_min,
        code: this.dataUser.code,
      });
    }

  }

}
