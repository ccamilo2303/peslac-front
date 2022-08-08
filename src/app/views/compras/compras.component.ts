import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VentasService } from './services/ventas.service';
import { ClientesService } from '../clientes/services/clientes.service';
import { ProductService } from '../products/services/product-service/product.service';
import { AppService } from '../../app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { PrintService } from './services/print.service';
import Swal from 'sweetalert2';
import { ProveedoresService } from '../proveedores/services/proveedores.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit, OnDestroy {
  title = 'angular-print-service';
  onPrintInvoice() {
    const invoiceIds = ['101'];
    this.printService.printDocument('invoice', invoiceIds);
  }

  onStarted(started: any) {
    console.log(started);
  }

  barcode: string = '';

  onKey(event: any) {
    this.barcode = event.target.value;
  }


  //Suscripciones
  private queryClientesSubscription!: Subscription;
  private queryProductosSubscription!: Subscription;
  private queryMetodosPagoSubscription!: Subscription;
  private queryCondicionPagoSubscription!: Subscription;
  private queryTiposImpuestoSubscription!: Subscription;



  //Variables de vista
  public clientes: any[] = [];
  public productos: any[] = [];
  public metodosPago: any[] = [];
  public condicionesPago: any[] = [];
  public listadoProductos: any[] = [];
  public modalCliente: boolean = false;
  public modalBalanza: boolean = false;
  public dataModal!: any;
  public valorTotal : number = 0;
  public tiposImpuestos: any[] = [];


  form: FormGroup = new FormGroup({
    fecha: new FormControl({ value: this.formatDate(new Date()), disabled: true }, []),
    vendedor: new FormControl({ value: this.authService.getInfoUsuario().nombres + ' ' + this.authService.getInfoUsuario().apellidos, disabled: true }, []),
    nit: new FormControl({ value: this.authService.getInfoUsuario().nit, disabled: true }, []),
    consecutivo: new FormControl('', [Validators.required]),
    cliente: new FormControl({}, [Validators.required]),
    estacion: new FormControl({ value: this.authService.getInfoUsuario().estacion, disabled: true }, []),
    noVenta: new FormControl({ value: '', disabled: true }, []),
    producto: new FormControl({}, []),
    cantidad: new FormControl(0, []),
    metodoPago: new FormControl({}, [Validators.required]),
    condicionPago: new FormControl({}, [Validators.required]),
    precioVenta: new FormControl({ value: '0', disabled: true }, []),
    tipoOrden: new FormControl({}, [Validators.required])
  });


  constructor(private authService: AuthService, private appService: AppService, private productService: ProductService, private clientesService: ClientesService, private ventasService: VentasService, public printService: PrintService, private proveedoresService:ProveedoresService) { }

  ngOnInit(): void {
    
    

    this.queryClientesSubscription = this.proveedoresService.getProveedores().subscribe(({ data }) => {
      this.clientes = data.proveedores;
    });

    this.queryProductosSubscription = this.productService.getProductsVenta().subscribe(({ data }) => {
      this.productos = data.productos;
    });

    this.queryMetodosPagoSubscription = this.appService.getListadoMetodosPago().subscribe(({ data }) => {
      this.metodosPago = data.metodos_pago;
    });

    this.queryCondicionPagoSubscription = this.appService.getListadoCondicionPago().subscribe(({ data }) => {
      this.condicionesPago = data.condiciones_pago;
    });

    this.queryTiposImpuestoSubscription = this.appService.getTiposImpuesto().subscribe(({ data, loading }) => {
      this.tiposImpuestos = data.tipos_impuesto;
    });

    this.form.reset(); 
    this.cargarDatosBasicos();
  }


  cargarDatosBasicos(){
    this.form.get('fecha')?.setValue(this.formatDate(new Date()));
    this.form.get('vendedor')?.setValue(this.authService.getInfoUsuario().nombres + ' ' + this.authService.getInfoUsuario().apellidos);
    this.form.get('nit')?.setValue(this.authService.getInfoUsuario().nit);
    this.form.get('estacion')?.setValue(this.authService.getInfoUsuario().estacion);
  }

  buscarProductos(){

    if(this.listadoProductos.length > 0){

      Swal.fire({
        title: 'Ya se han cargado productos a este cliente, si se cambia los productos se van a quitar de la venta, ¿desea continuar?',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.listadoProductos = [];
          this.buscarProductosCliente();
        } 
      })

    }else{
      this.buscarProductosCliente();
      
    }

    
  }

  buscarProductosCliente(){
    let cliente = this.form.controls['cliente'].value;
    this.queryProductosSubscription = this.productService.productosListaPrecios(cliente.id_lista_precios).subscribe(({ data }) => {
      this.productos = data.detalle_lista_precios;
      console.log("cliente seleccionado : ", cliente, " PRODUCTOS: ", this.productos);
      this.calcularPrecioVenta();
    });
  }

  addProducto() {


    let productoSeleccionado: any = this.form.controls['producto'].value;

    if (!productoSeleccionado.id) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe seleccionar un producto',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    let cantidad = this.form.controls['cantidad'].value;

    if (cantidad <= 0) {
      Swal.fire({
        title: 'Error!',
        text: 'La cantidad debe ser mayor o igual a cero',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    /*if(this.form.controls['producto'].value.precio_lista == undefined || this.form.controls['producto'].value.precio_lista == null || this.form.controls['producto'].value.precio_lista == 0){
      Swal.fire({
        title: 'Error!',
        text: 'El producto para este cliente no tiene configurado un precio de lista, no se puede agregar el producto',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }*/


    let previo = this.listadoProductos.filter(x => x.id == productoSeleccionado.id);
    console.log("previo: ", previo);
    if(previo != undefined && previo.length > 0){
      cantidad = cantidad + previo[0].cantidad;
      this.listadoProductos = this.listadoProductos.filter(x => x.id != productoSeleccionado.id);
    }

    productoSeleccionado = {...productoSeleccionado, precio_lista: this.form.controls['producto'].value.precio_costo };
    let productoLista = { ...productoSeleccionado, cantidad: cantidad }
    productoLista.valor_descuento = this.calcularDescuento(productoSeleccionado, cantidad);
    productoLista.total = productoLista.precio_lista * productoLista.cantidad;
    this.listadoProductos.push(productoLista);
    
    this.valorTotal = 0;
    this.listadoProductos.forEach(x => this.valorTotal = this.valorTotal + x.total);

    this.form.controls['producto'].setValue({});
    this.form.controls['cantidad'].setValue(0);
    this.form.controls['precioVenta'].setValue(0);

  }

  calcularPeso(){
    console.log("Calcular Peso");
    let productoSeleccionado = this.form.controls['producto'].value;
    if(productoSeleccionado.id_tipo_cantidad == 1){
      this.abrirModalBalanza();
    }
    console.log("Producto --> ", productoSeleccionado);
  }

  calcularPrecioVenta() {
    let productoSeleccionado = this.form.controls['producto'].value;
    let cantidad = this.form.controls['cantidad'].value;
    if (productoSeleccionado.id && cantidad > 0) {
    }

    this.form.controls['precioVenta'].setValue(productoSeleccionado.precio_costo);

  }

  calcularDescuento(producto: any, cantidad: any) {
    let descuento = producto.config_descuentos.filter((x: any) => cantidad >= x.cantidad_min && cantidad <= x.cantidad_max);
    if (descuento && descuento.length > 0) {
      return (producto.precio_venta * descuento[0].descuento) / 100
    }
    return 0;
  }


  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  abrirModalCliente() {
    this.modalCliente = true;
  }

  abrirModalBalanza() {
    this.modalBalanza = true;
  }

  pesoEvent(peso:any){
    this.form.controls['cantidad'].setValue(peso);
  }

  closeEventModal() {
    this.modalCliente = false;
    this.refresh();
    this.modalBalanza = false;
  }

  quitarProducto(item: any) {
    this.listadoProductos = this.listadoProductos.filter(x => x.id != item.id);
  }



  refresh() {
    this.clientesService.refreshClientes();

  }

  guardarInformacion() {

    if (this.listadoProductos.length == 0) {
      this.mensajeErrorValidacion("Debe agregar productos");
      return;
    }

    if (!this.form.controls['cliente'].value.id) {
      this.mensajeErrorValidacion("Debe seleccionar un cliente");
      return;
    }

    if (!this.form.controls['metodoPago'].value.id) {
      this.mensajeErrorValidacion("Debe seleccionar un método de pago");
      return;
    }

    if (!this.form.controls['condicionPago'].value.id) {
      this.mensajeErrorValidacion("Debe seleccionar una condición de pago");
      return;
    }

    if (!this.form.controls['tipoOrden'].value.id) {
      this.mensajeErrorValidacion("Debe seleccionar una tipo de orden");
      return;
    }

    Swal.fire({
      title: 'Registrando Venta...',
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        this.mensajeError();
      }
    })

    let objOrden = {
      id_usuario: this.authService.getInfoUsuario().idUsuario,
      consecutivo: this.form.controls['consecutivo'].value,
      id_cliente: this.form.controls['cliente'].value.id,
      id_metodo_pago: this.form.controls['metodoPago'].value.id,
      id_condicion_pago: this.form.controls['condicionPago'].value.id,
      id_tipo_venta: this.form.controls['condicionPago'].value.id,
    }

    let objDetalleOrden: any[] = [];


    this.ventasService.crearOrden(objOrden).subscribe({
      next: (resOrden: any) => {
        let id = resOrden.data.insert_ordenes_one.id;
        this.llenarListaProductos(objDetalleOrden, id);
        console.log("objDetalleOrden: ", objDetalleOrden);
        this.ventasService.crearDetalleOrden(objDetalleOrden).subscribe({
          next: (resDetalleOrden: any) => {
            let ids = resDetalleOrden.data.insert_detalle_ordenes.returning;
            console.log("resDetalleOrden: ", ids);

            this.ventasService.crearVenta(id).subscribe({
              next: (resVenta: any) => {
                let id = resVenta.data.insert_ventas_one.id;
                console.log("resVenta: ", resVenta);
                this.mensajeOk();
              },
              error: (e) => this.mensajeError()
            })
          },
          error: (e) => this.mensajeError()
        })
      },
      error: (e) => this.mensajeError(),
    });
  }

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
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


  private llenarListaProductos(objDetalleOrden: any[], id: any) {
    this.listadoProductos.forEach(item => {
      let producto = {
        id_venta: id,
        id_producto: item.id,
        cantidad: item.cantidad,
        total: item.cantidad * item.precio_venta
      }
      objDetalleOrden.push(producto);
    });

  }

  cancelarOrden(){
    Swal.fire({
      title: 'Cancelando proceso ...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        
        this.form.reset(); 
        this.listadoProductos = []; 
        this.cargarDatosBasicos();

      }
    })
  }


  inputImpuesto(event: any) {
    console.log(event.path[0][event.target.value - 1].attributes);
    if (event.path[0][event.target.value - 1].attributes[2].nodeValue == 'true') {
      this.form.controls['valor_impuesto'].enable();
    } else {
      this.form.controls['valor_impuesto'].setValue(0);
      this.form.controls['valor_impuesto'].disable();
      this.precioVenta();
    }
    console.log(this.form.controls['valor_impuesto'].status);
  }

  precioVenta() {
    let porcentaje = (this.form.controls['precio_costo'].value * this.form.controls['valor_impuesto'].value) / 100;
    this.form.controls['precio_venta'].setValue(this.form.controls['precio_costo'].value + porcentaje);
  }



  keyPress(event: KeyboardEvent) {
    console.log("event: ", event);
  }

  ngOnDestroy() {

    if(this.queryClientesSubscription){
      this.queryClientesSubscription.unsubscribe();
    }

    if(this.queryProductosSubscription){
      this.queryProductosSubscription.unsubscribe();
    }

    if(this.queryMetodosPagoSubscription){
      this.queryMetodosPagoSubscription.unsubscribe();
    }

    if(this.queryCondicionPagoSubscription){
      this.queryCondicionPagoSubscription.unsubscribe();
    }
    
    if(this.queryTiposImpuestoSubscription){
      this.queryTiposImpuestoSubscription.unsubscribe();
    }

  }



}

