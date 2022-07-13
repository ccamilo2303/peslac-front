import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { ProveedoresService } from '../../services/proveedores.service';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-agregar-proveedores',
  templateUrl: './modal-agregar-proveedores.component.html',
  styleUrls: ['./modal-agregar-proveedores.component.scss']
})
export class ModalAgregarProveedoresComponent implements OnInit {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  public tiposUsuarios!:any;
  
  form: FormGroup = new FormGroup({
    razon_social: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
    celular: new FormControl('', [Validators.required]),
    cuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    tipo_cuenta: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  constructor(private proveedoresService:ProveedoresService, private appService: AppService) { }

  ngOnInit(): void {

    this.initForm();
    $("#modalAgregarProducto").modal('hide');
    $("#modalAgregarPaquete").modal('hide');
    $("#modalProveedor").modal({backdrop:'static',keyboard:false, show:true});
    
  }
  
  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
    $("#modalAgregarProducto").modal({backdrop:'static',keyboard:false, show:true});
    $("#modalAgregarPaquete").modal({backdrop:'static',keyboard:false, show:true});
  }


  submit() {

    if(!this.data){
      this.proveedoresService.createProveedores(this.form.value).subscribe(({ data }) => {
        this.mensajeOk();
      },(error) => {
        this.mensajeError();
      });

    }else{
     
      this.proveedoresService.editProveedores(this.form.value, this.data.id)
      .subscribe(({ data }) => {
        this.mensajeOk();
      },(error) => {
        this.mensajeError();
      });
  
    }
   
  }

  initForm() {


    if (this.data && this.data.id != null) {
      this.form.setValue({

        razon_social: this.data.razon_social,
        nombre: this.data.nombre,
        nit: this.data.nit,
        celular: this.data.celular,
        cuenta: this.data.cuenta,
        banco: this.data.banco,
        tipo_cuenta: this.data.tipo_cuenta,
        direccion: this.data.direccion,
        correo: this.data.correo,
        telefono: this.data.telefono,
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

}

