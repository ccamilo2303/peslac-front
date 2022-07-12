import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ProductService } from '../../services/product-service/product.service';
import { PackageService } from '../../services/package-service/package.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-modal-add-package',
  templateUrl: './modal-add-package.component.html',
  styleUrls: ['./modal-add-package.component.scss']
})
export class ModalAddPackageComponent implements OnInit, OnDestroy {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  modalAgregarProveedor: boolean = false;
  modal: string = "";

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

    if (!this.data.id) {

      this.productForm.value.productos.forEach((product:any) => {
        product.id_paquete = id;
      });
  
      this.packageService.createPackageConfiguration(this.productForm.value.productos).subscribe(({ data }) => {
        this.mensajeOk();
      }, (error) => {
        this.mensajeError();
        this.form.controls['valor_impuesto'].disable();
        this.form.controls['precio_venta'].disable();
      });

    } else {

      this.packageService.editPackageConfiguration(this.productForm.value.productos, this.data.id)
        .subscribe(({ data }) => {
          this.mensajeOk();
        }, (error) => {
          this.mensajeError();
          this.form.controls['valor_impuesto'].disable();
          this.form.controls['precio_venta'].disable();
        });

    }

  }  


  ngOnInit(): void {
    this.initForm();
    $("#modalPaquete").modal('hide');
    $("#modalAgregarPaquete").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  refresh() {
    this.productService.refreshProducts();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarPaquete").modal('hide');
    $("#modalPaquete").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  openModal(data?: any) {
    switch (this.modal) {
      case 'modalAgregarProveedor':
        this.modalAgregarProveedor = true;
        break;
    }
    if (data) {
      this.data = data;
    } else {
      this.data = {};
    }
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarProveedor':
        this.modalAgregarProveedor = false;
        break;
    }
    this.refresh();
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
      this.mensajeErrorValidacion("La cantidad del paquete tiene que ser superior a cero");
      return;
    }

    if(this.form.controls['precio_costo'].value <= 0){
      this.mensajeErrorValidacion("El precio de costo del paquete tiene que ser superior a cero");
      return;
    }

    for(let x:number = 0; x < this.productForm.value.productos.length; x++){
      if(this.productForm.value.productos[x].cantidad <= 0){
        this.mensajeErrorValidacion("La cantidad del producto del paquete tiene que ser superior a cero");
        return;
      }
    }

    this.form.controls['valor_impuesto'].enable();
    this.form.controls['precio_venta'].enable();
    console.log(this.form.value);

    if (!this.data.id) {
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        let res:any = data;
        this.packageService.createPackage({id_producto: res.insert_productos_one.id}).subscribe(({ data }) => {
          res = data;
          this.submitProduct(res.insert_paquetes_one.id);
        }, (error) => {
          this.mensajeError();
          this.form.controls['valor_impuesto'].disable();
          this.form.controls['precio_venta'].disable();
        });
      }, (error) => {
        this.mensajeError();
        this.form.controls['valor_impuesto'].disable();
        this.form.controls['precio_venta'].disable();
      });

    } else {

      this.productService.editProduct(this.form.value, this.data.id)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.submitProduct();
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
    this.querySubscription = this.appService.getListadoProductos().subscribe(({ data, loading }) => {
      this.listadoProductos = data.productos;
    });

    if (this.data && this.data.id != null) {
      console.log(this.data);
      this.form.setValue({
        nombre: this.data.producto.nombre,
        cantidad: this.data.producto.cantidad,
        precio_costo: this.data.producto.precio_costo,
        id_tipo_impuesto: this.data.producto.id_tipo_impuesto,
        valor_impuesto: this.data.producto.valor_impuesto,
        precio_venta: this.data.producto.precio_venta,
        id_proveedor: this.data.producto.id_proveedor,
        descripcion: this.data.producto.descripcion,
        id_linea: this.data.producto.id_linea,
        imagen: this.data.producto.imagen,
        codigo_barras: this.data.producto.codigo_barras,
        inventario_min: this.data.producto.inventario_min,
        habilitado: this.data.producto.habilitado,
        //id_usuario_registro: this.data.id_usuario_registro,
        id_tipo_cantidad: this.data.producto.id_tipo_cantidad,
      });

      for(let i:number = 0; i < this.data.configuracion_paquetes.length; i++){
        this.addProducto();
        let productosTemp:any = this.productForm.controls['productos'];
        productosTemp.controls[i].controls.id_paquete.setValue(this.data.id);
        productosTemp.controls[i].controls.id_producto.setValue(this.data.configuracion_paquetes[i].producto.id);
        productosTemp.controls[i].controls.cantidad.setValue(this.data.configuracion_paquetes[i].cantidad);
      }

    }else{
      this.addProducto();
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
