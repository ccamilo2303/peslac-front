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

  constructor(private productService: ProductService) { }

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
  public data: Product = new Product();

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {
    if (this.data.id == null) {
      this.productService.createProduct(this.form.value).subscribe(
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
      this.productService.editProduct(this.form.value).subscribe(
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

    if (this.data.id != null) {
      this.form.setValue({
        name: this.data.name,
        quantity: this.data.quantity,
        type_product: this.data.type_product,
        price: this.data.price,
        iva: this.data.iva,
        supplier: this.data.supplier,
        description: this.data.description,
        type: this.data.type,
        image_url: this.data.image_url,
        state_product: this.data.state_product,
        inventary_min: this.data.inventary_min,
        code: this.data.code,
      });
    }

  }

}
