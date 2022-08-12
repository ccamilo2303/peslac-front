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

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit, OnDestroy {
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



  //Variables de vista
  public clientes: any[] = [];
  public productos: any[] = [];
  public metodosPago: any[] = [];
  public condicionesPago: any[] = [];
  public listadoProductos: any[] = [];
  public modalCliente: boolean = false;
  public modalBalanza: boolean = false;
  public dataModal!: any;

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
    precioVenta: new FormControl({ value: '', disabled: true }, []),
    tipoOrden: new FormControl({}, [Validators.required])
  });


  constructor(private authService: AuthService, private appService: AppService, private productService: ProductService, private clientesService: ClientesService, private ventasService: VentasService, public printService: PrintService) { }

  ngOnInit(): void {

    this.queryClientesSubscription = this.clientesService.getClientes().subscribe(({ data }) => {
      this.clientes = data.clientes;
    });

    this.queryMetodosPagoSubscription = this.appService.getListadoMetodosPago().subscribe(({ data }) => {
      this.metodosPago = data.metodos_pago;
    });

    this.queryCondicionPagoSubscription = this.appService.getListadoCondicionPago().subscribe(({ data }) => {
      this.condicionesPago = data.condiciones_pago;
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


    let productoLista = { ...productoSeleccionado, cantidad: this.form.controls['cantidad'].value }
    productoLista.valor_descuento = this.calcularDescuento(productoSeleccionado, cantidad);
    this.listadoProductos.push(productoLista);

    this.form.controls['producto'].setValue({});
    this.form.controls['cantidad'].setValue(0);

  }

  calcularPeso(){
    console.log("Calcular Peso");
    let productoSeleccionado = this.form.controls['producto'].value;
    if(productoSeleccionado.id_tipo_cantidad == 1){
      this.abrirModalBalanza();
    }
    console.log("Producto --> ", productoSeleccionado);
  }

  consultarProductos(idListaProducto:any){
    this.queryProductosSubscription = this.productService.productosListaPrecios(idListaProducto).subscribe(({ data }) => {
      this.productos = data.detalle_lista_precios;
    });

  }

  calcularPrecioVenta() {
    let productoSeleccionado = this.form.controls['producto'].value;
    let cantidad = this.form.controls['cantidad'].value;
    if (productoSeleccionado.id && cantidad > 0) {



    }
  }

  calcularDescuento(producto: any, cantidad: any) {
    /*let descuento = producto.descuentos.filter((x: any) => cantidad >= x.cantidad_min && cantidad <= x.cantidad_max);
    if (descuento && descuento.length > 0) {
      return (producto.precio_venta * descuento[0].descuento) / 100
    }
    return 0;*/
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

  keyPress(event: KeyboardEvent) {
    console.log("event: ", event);
  }

  ngOnDestroy() {


    this.queryClientesSubscription.unsubscribe();
    this.queryProductosSubscription.unsubscribe();
    this.queryMetodosPagoSubscription.unsubscribe();
    this.queryCondicionPagoSubscription.unsubscribe();
  }



}

