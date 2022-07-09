import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ProductService } from '../../services/product-service/product.service';
import { PackageService } from '../../services/package-service/package.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-add-package',
  templateUrl: './modal-add-package.component.html',
  styleUrls: ['./modal-add-package.component.scss']
})
export class ModalAddPackageComponent implements OnInit, OnDestroy {

  @Input()
  public displayStyle: string = '';

  @Input()
  public dataPackage: any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  public tiposProveedores!: any;
  public tiposCantidades!: any;
  public tiposImpuestos!: any;
  public tiposLineas!: any;
  public listadoProductos!: any;
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


  productForm: FormGroup;  


  constructor(private productService: ProductService, private packageService: PackageService, private appService: AppService, private fb:FormBuilder) {
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
      id_paquete: new FormControl('0', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
    })  
  }  
     
  addProducto() {  
    this.productos().push(this.nuevoProducto());  
  }  
     
  deleteProducto(i:number) {  
    this.productos().removeAt(i);  
  }  
     
  submitProduct(id?:any) {  

    if (!this.dataPackage.id) {

      this.productForm.value.productos.forEach((product:any) => {
        product.id_paquete = id;
      });
  
      this.packageService.createPackageConfiguration(this.productForm.value.productos).subscribe(({ data }) => {
        console.log('got data', data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    } else {

      this.packageService.editPackageConfiguration(this.productForm.value.productos, this.dataPackage.id)
        .subscribe(({ data }) => {
          console.log('got data', data);
        }, (error) => {
          console.log('there was an error sending the query', error);
        });

    }

  }  


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

    if (!this.dataPackage.id) {
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
        let res:any = data;
        this.packageService.createPackage({id_producto: res.insert_productos_one.id}).subscribe(({ data }) => {
          console.log('got data', data);
          res = data;
          this.submitProduct(res.insert_paquetes_one.id);
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
      }, (error) => {
        console.log('there was an error sending the query', error);
        this.form.controls['valor_impuesto'].disable();
        this.form.controls['precio_venta'].disable();
      });

    } else {

      this.productService.editProduct(this.form.value, this.dataPackage.id)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.submitProduct();
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
    this.querySubscription = this.appService.getListadoProductos().subscribe(({ data, loading }) => {
      this.listadoProductos = data.productos;
    });

    if (this.dataPackage.id != null) {
      console.log(this.dataPackage);
      this.form.setValue({
        nombre: this.dataPackage.producto.nombre,
        cantidad: this.dataPackage.producto.cantidad,
        precio_costo: this.dataPackage.producto.precio_costo,
        id_tipo_impuesto: this.dataPackage.producto.id_tipo_impuesto,
        valor_impuesto: this.dataPackage.producto.valor_impuesto,
        precio_venta: this.dataPackage.producto.precio_venta,
        id_proveedor: this.dataPackage.producto.id_proveedor,
        descripcion: this.dataPackage.producto.descripcion,
        id_linea: this.dataPackage.producto.id_linea,
        imagen: this.dataPackage.producto.imagen,
        codigo_barras: this.dataPackage.producto.codigo_barras,
        inventario_min: this.dataPackage.producto.inventario_min,
        habilitado: this.dataPackage.producto.habilitado,
        //id_usuario_registro: this.dataPackage.id_usuario_registro,
        id_tipo_cantidad: this.dataPackage.producto.id_tipo_cantidad,
      });

      for(let i:number = 0; i < this.dataPackage.configuracion_paquetes.length; i++){
        this.addProducto();
        let productosTemp:any = this.productForm.controls['productos'];
        productosTemp.controls[i].controls.id_paquete.setValue(this.dataPackage.id);
        productosTemp.controls[i].controls.id_producto.setValue(this.dataPackage.configuracion_paquetes[i].producto.id);
        productosTemp.controls[i].controls.cantidad.setValue(this.dataPackage.configuracion_paquetes[i].cantidad);
      }

    }else{
      this.addProducto();
    }

  }

}
