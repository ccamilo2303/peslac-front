import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-add-discount',
  templateUrl: './modal-add-discount.component.html',
  styleUrls: ['./modal-add-discount.component.scss']
})
export class ModalAddDiscountComponent implements OnInit {

  loading: boolean = false;

  @Input()
  public dataDescuentos: any[] = [];

  @Output()
  public descuentos = new EventEmitter<any[]>();

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    cantidad_minima: new FormControl('', [Validators.required]),
    cantidad_maxima: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
    $("#modalAgregarProducto").modal('hide');
    $("#modalAgregarPaquete").modal('hide');
    $("#modalAgregarDescuentos").modal({ backdrop: 'static', keyboard: false, show: true });
  }


  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    this.descuentos.emit(this.dataDescuentos);
    $("#modalAgregarDescuentos").modal('hide');
    $("#modalAgregarProducto").modal({ backdrop: 'static', keyboard: false, show: true });
    $("#modalAgregarPaquete").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  agregarDescuento() {
    let validacionDescuento: any[] = this.dataDescuentos.filter((descuento: any) => JSON.stringify(descuento) === JSON.stringify(this.form.value));
    console.log(validacionDescuento);
    if (validacionDescuento.length > 0) {
      this.mensajeErrorValidacion("El descuento ya existe");
      return;
    }
    this.dataDescuentos.push(this.form.value);
    this.form.reset();
    this.mensajeOk();
  }

  eliminarDescuento(descuento: any) {
    let indice: any = this.dataDescuentos.indexOf(descuento);
    this.dataDescuentos.splice(indice, 1);
  }

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  private mensajeError() {
    Swal.fire({
      title: 'Error guardando la información',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  private mensajeErrorValidacion(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
