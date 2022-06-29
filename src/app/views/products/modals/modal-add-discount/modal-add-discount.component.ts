import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { DiscountService } from '../../services/discount.service';
import { Product } from '../../response-types/product';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-discount',
  templateUrl: './modal-add-discount.component.html',
  styleUrls: ['./modal-add-discount.component.scss']
})
export class ModalAddDiscountComponent implements OnInit {

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity_minimal: new FormControl('', [Validators.required]),
    quantity_maximum: new FormControl('', [Validators.required]),
    discount: new FormControl('', [Validators.required]),
    discounted_value: new FormControl('', [Validators.required]),
  });

  constructor(private discountService: DiscountService) { }

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
      this.discountService.createDiscount(this.form.value).subscribe(
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
      this.discountService.editDiscount(this.form.value).subscribe(
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
        name: '1',
        quantity_minimal: '1',
        quantity_maximum: '1',
        discount: '1',
        discounted_value: '1',
      });
    }

  }

}
