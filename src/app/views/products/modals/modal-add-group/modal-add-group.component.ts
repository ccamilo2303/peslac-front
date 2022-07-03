import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import { GroupService } from '../../services/group-service/group.service';
import { Product } from '../../response-types/product';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-group',
  templateUrl: './modal-add-group.component.html',
  styleUrls: ['./modal-add-group.component.scss']
})
export class ModalAddGroupComponent implements OnInit {

  form:any;

  constructor(private groupService: GroupService, private fb: FormBuilder) { 
    this.form = this.fb.group({
      group_name: '',
      products: this.fb.array([]),
    });
  }

  addProduct() {
    const product = this.form.controls.products as FormArray;
    product.push(this.fb.group({
      id: '',
    }));
    console.log(this.form.value);
  }

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
      this.groupService.createGroup(this.form.value).subscribe(
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
      this.groupService.editGroup(this.form.value).subscribe(
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
      const product = this.form.controls.products as FormArray;
      this.form.controls['group_name'].setValue('Nombre del grupo');
      product.push(this.fb.group({id:''}, {id:''}));
    }

  }

}
