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

  public listaPrecios!: any;
  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    cedula: new FormControl('', [Validators.required]),
    celular: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    id_lista_precios: new FormControl('', [Validators.required]),
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

    
      this.inventarioService.createSalidaInventario(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    

  }

  initForm() {

    this.querySubscription = this.appService.getListadoProveedores().subscribe(({ data, loading }) => {
      this.listaPrecios = data.proveedores;
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
