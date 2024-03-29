import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-agregar-producto',
  templateUrl: './modal-agregar-producto.component.html',
  styleUrls: ['./modal-agregar-producto.component.scss']
})
export class ModalAgregarProductoComponent implements OnInit {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  modalProveedores: boolean = false;
  modal: string = "";
  loading: boolean = false;

  public tiposProveedores!: any;
  public tiposCantidades!: any;
  public tiposImpuestos!: any;
  public tiposLineas!: any;
  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    cantidad: new FormControl(0, [Validators.required]),
    precio_costo: new FormControl(0, [Validators.required]),
    id_tipo_impuesto: new FormControl('', [Validators.required]),
    valor_impuesto: new FormControl({ value: 0, disabled: true }, [Validators.required]),
    precio_venta: new FormControl({ value: 0, disabled: true }, [Validators.required]),
    id_proveedor: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_linea: new FormControl('', [Validators.required]),
    imagen: new FormControl('', [Validators.required]),
    codigo_barras: new FormControl('', [Validators.required]),
    inventario_min: new FormControl('0'),
    habilitado: new FormControl('0'),
    //id_usuario_registro: new FormControl('', [Validators.required]),
    id_tipo_cantidad: new FormControl('', [Validators.required]),
  });

  constructor(private productService: ProductService, private appService: AppService) { }

  ngOnInit(): void {
    this.initForm();
    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.controls['imagen'].setValue(reader.result);
    };
  }

  precioVenta() {
    let porcentaje = (this.form.controls['precio_costo'].value * this.form.controls['valor_impuesto'].value) / 100;
    this.form.controls['precio_venta'].setValue(this.form.controls['precio_costo'].value + porcentaje);
  }

  inputImpuesto(event: any) {

    if (event == 5) {
      this.form.controls['valor_impuesto'].enable();
    } else {
      this.form.controls['valor_impuesto'].setValue(0);
      this.form.controls['valor_impuesto'].disable();
      this.precioVenta();
    }
  }

  submit() {

    if(this.form.controls['cantidad'].value <= 0){
      this.mensajeErrorValidacion("La cantidad del producto tiene que ser superior a cero");
      return;
    }

    if(this.form.controls['precio_costo'].value <= 0){
      this.mensajeErrorValidacion("El precio de costo del producto tiene que ser superior a cero");
      return;
    }
    
    this.form.controls['valor_impuesto'].enable();
    this.form.controls['precio_venta'].enable();
    console.log(this.form.value);

    if (!this.data.id) {
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        this.mensajeOk();
      }, (error) => {
        this.mensajeError();
      });

    } else {

      this.productService.editProduct(this.form.value, this.data.id)
        .subscribe(({ data }) => {
          this.mensajeOk();
        }, (error) => {
          this.mensajeError();
        });

    }

  }

  initForm() {

    this.querySubscription = this.appService.getListadoProveedores().subscribe(({ data, loading }) => {
      this.tiposProveedores = data.proveedores;
    });
    this.querySubscription = this.appService.getTiposCantidad().subscribe(({ data, loading }) => {
      this.tiposCantidades = data.tipos_cantidad;
    });
    this.querySubscription = this.appService.getTiposImpuesto().subscribe(({ data, loading }) => {
      this.tiposImpuestos = data.tipos_impuesto;
    });
    this.querySubscription = this.appService.getLineasProducto().subscribe(({ data, loading }) => {
      this.tiposLineas = data.lineas_producto;
    });

    if (this.data.id != null) {
      console.log(this.data);
      this.form.setValue({
        nombre: this.data.nombre,
        cantidad: this.data.cantidad,
        precio_costo: this.data.precio_costo,
        id_tipo_impuesto: this.data.id_tipo_impuesto,
        valor_impuesto: this.data.valor_impuesto,
        precio_venta: this.data.precio_venta,
        id_proveedor: this.data.id_proveedor,
        descripcion: this.data.descripcion,
        id_linea: this.data.id_linea,
        imagen: this.data.imagen,
        codigo_barras: this.data.codigo_barras,
        inventario_min: this.data.inventario_min,
        habilitado: this.data.habilitado,
        //id_usuario_registro: this.data.id_usuario_registro,
        id_tipo_cantidad: this.data.id_tipo_cantidad,
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
