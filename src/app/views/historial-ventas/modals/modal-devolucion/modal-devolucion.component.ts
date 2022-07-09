import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from '../../services/historial-ventas.service';
declare var $: any;

@Component({
  selector: 'app-modal-devolucion',
  templateUrl: './modal-devolucion.component.html',
  styleUrls: ['./modal-devolucion.component.scss']
})
export class ModalDevolucionComponent implements OnInit {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    id_producto: new FormControl('', [Validators.required]),
    id_tipo_operacion: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    comentario: new FormControl('', [Validators.required]),
  });

  constructor(private historialVentasService: HistorialVentasService, private appService: AppService) { }

  ngOnInit(): void {

    console.log("data devo: ", this.data);
    $("#modalProveedor").modal('hide');
    $("#modalProveedor2").modal({ backdrop: 'static', keyboard: false, show: true });
    
    this.form.setValue({
      id_producto: this.data.producto.id,
      id_tipo_operacion: 2,
      cantidad: '',
      comentario: 'Devolución en venta',
    });

  }

  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalProveedor2").modal('hide');
    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });
  }


  submit() {

    if(this.form.controls["cantidad"].value > 0){
      
      this.historialVentasService.createDevolucionInventario(
        this.form.controls["id_producto"].value,
        this.form.controls["id_tipo_operacion"].value,
        this.form.controls["cantidad"].value,
        this.form.controls["comentario"].value
      ).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
      console.log("Error en la cantidad de devolución");
    }

  }


}
