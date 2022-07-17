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
    cantidad_min: new FormControl('', [Validators.required]),
    cantidad_max: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
    $("#modalAgregarProducto").modal('hide');
    $("#modalAgregarPaquete").modal('hide');
    $("#modalAgregarDescuentos").modal({ backdrop: 'static', keyboard: false, show: true });
    console.log("dataDescuentos: ",this.dataDescuentos);
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
    
    if(this.form.controls["cantidad_min"].value == 0 || this.form.controls["cantidad_max"].value == 0 || this.form.controls["descuento"].value == 0 ){
      this.mensajeErrorValidacion("No puede existir un campo con valor cero");
      return;
    }

    if(this.form.controls["cantidad_min"].value > this.form.controls["cantidad_max"].value){
      this.mensajeErrorValidacion("La cantidad mínima no puede ser superior a la máxima");
      return;
    }

    let validacionDescuento: any[] = this.dataDescuentos.filter((descuento: any) => JSON.stringify(descuento) === JSON.stringify(this.form.value));

    if (validacionDescuento.length > 0) {
      this.mensajeErrorValidacion("El descuento ya existe");
      return;
    }

    for(let x:number = 0; x < this.dataDescuentos.length; x++){

      if (this.form.controls["cantidad_min"].value >= this.dataDescuentos[x].cantidad_min && this.form.controls["cantidad_min"].value <= this.dataDescuentos[x].cantidad_max) {
        this.mensajeErrorValidacion("La cantidad mínima no esta disponible");
        return;
      }

      if (this.form.controls["cantidad_max"].value >= this.dataDescuentos[x].cantidad_min && this.form.controls["cantidad_max"].value <= this.dataDescuentos[x].cantidad_max) {
        this.mensajeErrorValidacion("La cantidad máxima no esta disponible");
        return;
      }

    }
    let info = {...this.form.value}
    console.log("this.form.value: ", info);
    this.dataDescuentos = Object.assign([], this.dataDescuentos);
    this.dataDescuentos.push(info);
    this.form.reset();
    this.mensajeOk();
  }

  eliminarDescuento(descuento: any) {
    let indice: any = this.dataDescuentos.indexOf(descuento);
    let arrayTemp = [...this.dataDescuentos];
    arrayTemp.splice(indice, 1);
    this.dataDescuentos = arrayTemp;
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
