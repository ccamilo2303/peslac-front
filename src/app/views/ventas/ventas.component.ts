import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ignoreElements, Subscription } from 'rxjs';
import { VentasService } from './services/ventas.service';
import { ClientesService } from '../clientes/services/clientes.service';
import { ProductService } from '../products/services/product-service/product.service';
import { AppService } from '../../app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit, OnDestroy {



  //Suscripciones
  private queryClientesSubscription!: Subscription;
  private queryProductosSubscription!: Subscription;
  private queryMetodosPagoSubscription!: Subscription;
  private queryCondicionPagoSubscription!: Subscription;
  


  //Variables de vista
  public clientes:any[] = [];
  public productos:any[] = [];
  public metodosPago:any[] = [];
  public condicionesPago:any[] = [];
  public listadoProductos:any[] = [];
  public modalCliente:boolean = false;
  public dataModal!: any;

  form: FormGroup = new FormGroup({
    fecha: new FormControl({value: this.formatDate(new Date()), disabled: true}, []),
    vendedor: new FormControl({value: this.authService.getInfoUsuario().nombres +' '+ this.authService.getInfoUsuario().apellidos, disabled: true}, []),
    nit: new FormControl({value: this.authService.getInfoUsuario().nit, disabled: true}, []),
    consecutivo: new FormControl('', [Validators.required]),
    cliente: new FormControl({}, [Validators.required]),
    estacion: new FormControl({value: this.authService.getInfoUsuario().estacion, disabled: true}, []),
    noVenta: new FormControl({value: '', disabled: true}, []),
    producto: new FormControl({}, []),
    cantidad: new FormControl(0, []),
    metodoPago: new FormControl({}, [Validators.required]),
    condicionPago: new FormControl({}, [Validators.required]),
    precioVenta: new FormControl({value: '', disabled: true}, []),
    tipoOrden: new FormControl({}, [Validators.required])
  });


  constructor(private authService:AuthService, private appService: AppService, private productService:ProductService, private clientesService: ClientesService, private ventasService:VentasService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  
    this.queryClientesSubscription = this.clientesService.getClientes().subscribe(({ data }) => {
      this.clientes = data.clientes;
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

  }

  addProducto(){


    let productoSeleccionado:any = this.form.controls['producto'].value;

    if(!productoSeleccionado.id){
      Swal.fire({
        title: 'Error!',
        text: 'Debe seleccionar un producto',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return ;
    }

    let cantidad = this.form.controls['cantidad'].value;

    if(cantidad <= 0){
      Swal.fire({
        title: 'Error!',
        text: 'La cantidad debe ser mayor o igual a cero',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return ;
    }

    
    let productoLista = {...productoSeleccionado, cantidad : this.form.controls['cantidad'].value}
    productoLista.valor_descuento = this.calcularDescuento(productoSeleccionado, cantidad);
    this.listadoProductos.push(productoLista);

    this.form.controls['producto'].setValue({});
    this.form.controls['cantidad'].setValue(0);

  }

  calcularPrecioVenta(){
    let productoSeleccionado = this.form.controls['producto'].value;
    let cantidad = this.form.controls['cantidad'].value;
    if(productoSeleccionado.id && cantidad > 0){
      


    }
  }

  calcularDescuento(producto:any, cantidad:any){
    let descuento = producto.descuentos.filter( (x:any) => cantidad >= x.cantidad_min && cantidad <= x.cantidad_max);
    if(descuento && descuento.length > 0){
      return (producto.precio_venta * descuento[0].descuento) / 100
    }
    return 0;
  }


  formatDate(date:Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  padTo2Digits(num:any) {
    return num.toString().padStart(2, '0');
  }

  abrirModalCliente(){
    this.modalCliente = true;
  }

  closeEventModal(){
    this.modalCliente = false;
    this.refresh();
  }

  quitarProducto(item:any){
    this.listadoProductos = this.listadoProductos.filter(x => x.id != item.id);
  }



  refresh() {
    this.clientesService.refreshClientes();

  }

  guardarInformacion(){
    let timerInterval:any;


    Swal.fire({
      title: 'Registrando Venta...',
      timer: 4000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        
        timerInterval = setInterval(() => {
          
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
        Swal.fire({ 
          title: 'Información guardada correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }
    })

    let objOrden = {
      id_usuario : this.authService.getInfoUsuario().idUsuario,
      consecutivo : this.form.controls['consecutivo'].value,
      id_cliente : this.form.controls['cliente'].value.id,
      id_metodo_pago : this.form.controls['metodoPago'].value.id,
      id_condicion_pago : this.form.controls['condicionPago'].value.id,
      id_tipo_venta : this.form.controls['condicionPago'].value.id,
    }
    this.ventasService.crearOrden({}).subscribe(res =>{

    });
  }


  ngOnDestroy() {
    

    this.queryClientesSubscription.unsubscribe();
    this.queryProductosSubscription.unsubscribe();
    this.queryMetodosPagoSubscription.unsubscribe();
    this.queryCondicionPagoSubscription.unsubscribe();
  }



}

