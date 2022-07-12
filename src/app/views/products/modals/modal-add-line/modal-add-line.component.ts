import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import { LineService } from '../../services/line-service/line.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-add-line',
  templateUrl: './modal-add-line.component.html',
  styleUrls: ['./modal-add-line.component.scss']
})
export class ModalAddLineComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private querySubscription!: Subscription;

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private lineService: LineService) { }

  ngOnInit(): void {
    this.initForm();
    $("#modalLinea").modal('hide');
    $("#modalAgregarLinea").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  
  refresh() {
    this.lineService.refreshLines();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarLinea").modal('hide');
    $("#modalLinea").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  submit() {
   
    this.lineService.editLine(this.form.value, this.data.id).subscribe(({ data }) => {
      this.mensajeOk();
      this.refresh();
    }, (error) => {
      this.mensajeError();
    });

  }

  initForm() {

    if (this.data && this.data.id != null) {
      this.form.controls['nombre'].setValue(this.data.nombre);  
    }

  }

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModal();
      }
    });
  }

  private mensajeError() {
    Swal.fire({
      title: 'Error guardando la información',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
