import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductService } from '../../services/product-service/product.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-add-product',
  templateUrl: './modal-add-product.component.html',
  styleUrls: ['./modal-add-product.component.scss']
})

export class ModalAddProductComponent implements OnInit, OnDestroy {

  @Input()
  public displayStyle: string = '';

  @Input()
  public dataProduct: any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

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
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
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
    this.form.controls['valor_impuesto'].enable();
    this.form.controls['precio_venta'].enable();
    console.log(this.form.value);
    
    if (!this.dataProduct.id) {
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    } else {

      this.productService.editProduct(this.form.value, this.dataProduct.id)
        .subscribe(({ data }) => {
          console.log('got data', data);
        }, (error) => {
          console.log('there was an error sending the query', error);
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

    if (this.dataProduct.id != null) {
      console.log(this.dataProduct);
      this.form.setValue({
        nombre: this.dataProduct.nombre,
        cantidad: this.dataProduct.cantidad,
        precio_costo: this.dataProduct.precio_costo,
        id_tipo_impuesto: this.dataProduct.id_tipo_impuesto,
        valor_impuesto: this.dataProduct.valor_impuesto,
        precio_venta: this.dataProduct.precio_venta,
        id_proveedor: this.dataProduct.id_proveedor,
        descripcion: this.dataProduct.descripcion,
        id_linea: this.dataProduct.id_linea,
        imagen: this.dataProduct.imagen,
        codigo_barras: this.dataProduct.codigo_barras,
        inventario_min: this.dataProduct.inventario_min,
        habilitado: this.dataProduct.habilitado,
        //id_usuario_registro: this.dataProduct.id_usuario_registro,
        id_tipo_cantidad: this.dataProduct.id_tipo_cantidad,
      });
    }

  }

}
