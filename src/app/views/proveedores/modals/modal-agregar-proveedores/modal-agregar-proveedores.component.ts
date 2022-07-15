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

  @Input()
  public listadoProveedores: any;

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
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required]),
  });

  constructor(private proveedoresService:ProveedoresService, private appService: AppService) { }

  ngOnInit(): void {
    console.log(this.listadoProveedores);
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

    this.form.controls["nit"].setValue(this.form.controls["nit"].value.toString());
    this.form.controls["celular"].setValue(this.form.controls["celular"].value.toString());
    this.form.controls["cuenta"].setValue(this.form.controls["cuenta"].value.toString());
    this.form.controls["telefono"].setValue(this.form.controls["telefono"].value.toString());

    if(!this.data){

      let validacionNit: any[] = this.listadoProveedores.filter((proveedor: any) => proveedor.nit == this.form.controls["nit"].value);
      let validacionCorreo: any[] = this.listadoProveedores.filter((proveedor: any) => proveedor.correo == this.form.controls["correo"].value);

      if (validacionNit.length > 0) {
        this.mensajeErrorValidacion("El NIT ingresado ya existe");
        return;
      }

      if (validacionCorreo.length > 0) {
        this.mensajeErrorValidacion("El correo ingresado ya existe");
        return;
      }

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

  private mensajeErrorValidacion(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}

