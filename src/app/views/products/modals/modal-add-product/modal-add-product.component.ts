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

  public tiposProveedores!:any;
  public tiposCantidades!:any;
  public tiposImpuestos!:any;
  public tiposLineas!:any;
  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    precio_costo: new FormControl('', [Validators.required]),
    id_tipo_impuesto: new FormControl('', [Validators.required]),
    valor_impuesto: new FormControl('', [Validators.required]),
    precio_venta: new FormControl('', [Validators.required]),
    id_proveedor: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_linea: new FormControl('', [Validators.required]),
    imagen: new FormControl('', [Validators.required]),
    codigo_barras: new FormControl('', [Validators.required]),
    inventario_min: new FormControl(''),
    habilitado: new FormControl(''),
    id_usuario_registro: new FormControl('', [Validators.required]),
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

  submit() {

    if(!this.dataProduct.id){
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
     
      this.productService.editProduct(this.form.value, this.dataProduct.id)
      .subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
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
      this.form.setValue({
        name: this.dataProduct.name,
        quantity: this.dataProduct.quantity,
        type_product: this.dataProduct.type_product,
        price: this.dataProduct.price,
        iva: this.dataProduct.iva,
        supplier: this.dataProduct.supplier,
        description: this.dataProduct.description,
        type: this.dataProduct.type,
        image_url: this.dataProduct.image_url,
        state_product: this.dataProduct.state_product,
        inventary_min: this.dataProduct.inventary_min,
        code: this.dataProduct.code,
      });
    }

  }

}
