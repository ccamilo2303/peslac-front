import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { InventarioService } from '../../services/inventario.service';
declare var $: any;

@Component({
  selector: 'app-modal-agregar-salida',
  templateUrl: './modal-agregar-salida.component.html',
  styleUrls: ['./modal-agregar-salida.component.scss']
})
export class ModalAgregarSalidaComponent implements OnInit {

  @Input()
  public displayStyle: string = '';

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

  constructor(private inventarioService: InventarioService, private appService: AppService) { }

  ngOnInit(): void {

    this.initForm();

    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });


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

    if(this.form.controls["cantidad"].value <= this.data.cantidad && this.form.controls["cantidad"].value > 0){
      
      this.inventarioService.createSalidaInventario(
        this.form.controls["id_producto"].value,
        this.form.controls["id_tipo_operacion"].value,
        (this.form.controls["cantidad"].value * -1),
        this.form.controls["comentario"].value
      ).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    }else{

      console.log("ERROR EN LA CANTIDAD DE SALIDA");
      
    }
    
  }

  initForm() {

    if (this.data && this.data.id != null) {
      this.form.setValue({
        id_producto: this.data.id,
        id_tipo_operacion: 1,
        cantidad: '',
        comentario: '',
      });
    }

  }

}
