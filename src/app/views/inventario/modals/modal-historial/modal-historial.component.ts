import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { InventarioService } from '../../services/inventario.service';
declare var $: any;




@Component({
  selector: 'app-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.scss']
})
export class ModalHistorialComponent implements OnInit, OnDestroy {

  @Input()
  public displayStyle: string = '';

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  public listado!: any;
  private querySubscription!: Subscription;

  constructor(private inventarioService: InventarioService, private appService: AppService) { }

  ngOnInit(): void {

    this.initForm();

    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });


  }

  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }


  submit() {

    
      /*this.inventarioService.createSalidaInventario(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });*/

    

  }

  initForm() {

    this.querySubscription = this.inventarioService.getHistorial().subscribe(({ data, loading }) => {
      this.listado = data.historial_devoluciones_salidas_productos;
    });
    

    /*if (this.data && this.data.id != null) {
      this.form.setValue({
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        cedula: this.data.cedula,
        celular: this.data.celular,
        ciudad: this.data.ciudad,
        direccion: this.data.direccion,
        id_lista_precios: this.data.id_lista_precios,
      });
    }*/

  }

}

