import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { TransformacionService } from '../../services/transformacion.service';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-agregar-transformacion',
  templateUrl: './modal-agregar-transformacion.component.html',
  styleUrls: ['./modal-agregar-transformacion.component.scss']
})
export class ModalAgregarTransformacionComponent implements OnInit, OnDestroy {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  public listadoProductos!: any;
  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    id_producto_destino: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
  });

  productForm: FormGroup;

  constructor(private transformacionService: TransformacionService, private appService: AppService, private fb:FormBuilder) { 
    this.productForm = this.fb.group({  
      productos: this.fb.array([]) ,  
    }); 
  }

  productos() : FormArray {  
    return this.productForm.get("productos") as FormArray  
  }  
     
  nuevoProducto(): FormGroup {  
    return this.fb.group({  
      id_producto: new FormControl('', [Validators.required]),
      id_transformacion: new FormControl('0', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
    })  
  }  
     
  addProducto() {  
    this.productos().push(this.nuevoProducto());  
  }  
     
  deleteProducto(i:number) {  
    this.productos().removeAt(i);  
  }  

  ngOnInit(): void {
    this.initForm();
    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }


  submit() {

    /*if (!this.data) {
      this.transformacionService.createClientes(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    } else {

      this.transformacionService.editClientes(this.form.value, this.data.id)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.closeModal();
        }, (error) => {
          console.log('there was an error sending the query', error);
        });

    }*/

  }

  initForm() {

    this.querySubscription = this.appService.getListadoProductos().subscribe(({ data, loading }) => {
      this.listadoProductos = data.productos;
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
