import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from '../../services/historial-ventas.service';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-anular-venta',
  templateUrl: './modal-anular-venta.component.html',
  styleUrls: ['./modal-anular-venta.component.scss']
})
export class ModalAnularVentaComponent implements OnInit {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    id_venta: new FormControl('', [Validators.required]),
    comentario: new FormControl('', [Validators.required]),
  });

  constructor(private historialVentasService: HistorialVentasService, private appService: AppService) { }

  ngOnInit(): void {

    console.log("DATA ANU: ", this.data);
    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });
    this.form.setValue({
      id_venta: this.data.id,
      comentario: '',
    });
  }

  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }


  submit() {

    this.historialVentasService.createAnularVenta(
      this.form.controls["id_venta"].value,
      this.form.controls["comentario"].value
    ).subscribe(({ data }) => {
      this.mensajeOk();
    }, (error) => {
      this.mensajeError();
    });

  }

  private mensajeOk() {
    Swal.fire({
      title: 'Venta anulada correctamente',
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
      title: 'Error anulando la venta',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
