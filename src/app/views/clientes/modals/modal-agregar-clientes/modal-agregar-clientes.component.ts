import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-agregar-clientes',
  templateUrl: './modal-agregar-clientes.component.html',
  styleUrls: ['./modal-agregar-clientes.component.scss']
})
export class ModalAgregarClientesComponent implements OnInit, OnDestroy {

  @Input()
  public data: any;

  @Input()
  public listadoClientes: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  modalAgregarListaPrecios:boolean = false;

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

  constructor(private clientesService: ClientesService, private appService: AppService) { }

  ngOnInit(): void {
    
    this.initForm();

    $("#modalAgregarCliente").modal({ backdrop: 'static', keyboard: false, show: true });

  }

  refresh() {
    this.clientesService.refreshClientes();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarCliente").modal('hide');
  }

  openModal(data?: any) {
    this.modalAgregarListaPrecios = true;
  }

  closeEventModal(){
    this.modalAgregarListaPrecios = false;
    this.refresh();
  }


  submit() {
    
    this.form.controls["cedula"].setValue(this.form.controls["cedula"].value.toString())
    this.form.controls["celular"].setValue(this.form.controls["celular"].value.toString())

    if (!this.data) {

      let validacionCedula: any[] = this.listadoClientes.filter((cliente: any) => cliente.cedula == this.form.controls["cedula"].value);

      if (validacionCedula.length > 0) {
        this.mensajeErrorValidacion("La cédula ingresada ya existe");
        return;
      }

      this.clientesService.createClientes(this.form.value).subscribe(({ data }) => {
        this.mensajeOk();
      }, (error) => {
        this.mensajeError();
      });

    } else {

      this.clientesService.editClientes(this.form.value, this.data.id)
        .subscribe(({ data }) => {
          this.mensajeOk();
        }, (error) => {
          this.mensajeError();
        });

    }

  }

  initForm() {

    this.querySubscription = this.appService.getListadoProveedores().subscribe(({ data, loading }) => {
      this.listaPrecios = data.proveedores;
    });

    if (this.data && this.data.id != null) {
      this.form.setValue({
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        cedula: this.data.cedula,
        celular: this.data.celular,
        ciudad: this.data.ciudad,
        direccion: this.data.direccion,
        id_lista_precios: this.data.id_lista_precios,
      });
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

  private mensajeErrorValidacion(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}

