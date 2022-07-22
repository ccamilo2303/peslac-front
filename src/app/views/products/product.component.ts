import { Component, OnInit, ChangeDetectorRef, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { ProductService } from './services/product-service/product.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { EventInterface } from '../../event.interface';

import { IpcService } from 'src/app/ipc.service';

declare var $: any;
declare var onScan: any;


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy, EventInterface {

  pong: boolean = false;
  
  modalAgregarProducto = false;
  modalLinea = false;
  modalAgregarPaquete = false;
  modalPaquete = false;
  modalListaPrecios = false;

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  listadoCopia: any = [];

  private querySubscription!: Subscription;
  public busqueda: string = '';

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private ipcService: IpcService, private cdRef: ChangeDetectorRef, private appService: AppService, private productService: ProductService, private componentFactoryResolver: ComponentFactoryResolver) { 
    if (ipcService.isElectron) {
      console.log('Run in electron');
    } else {
      console.log('Run in browser');
    }
  }

  ping = (): void => {
    this.ipcService.send("message", "ping");
    this.ipcService.on("reply", (event: any, arg: string) => {
      this.pong = arg === "pong";
      this.cdRef.detectChanges();
    });
  }


  ngOnInit(): void {

    this.querySubscription = this.productService.getProducts()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
        this.listadoCopia = data.productos;
        console.log("Productos --> ", data);
      });

    this.appService.eventInterface = this;



    console.log("VA A LEER");
    const port = new this.ipcService.serialPort.SerialPort({ path: 'COM4', baudRate: 9600 });
    const parser = new this.ipcService.serialPort.ReadlineParser();
      port.pipe(parser);
      parser.on('data', console.log);
      port.write('ROBOT PLEASE RESPOND\n');
      //parser.off('data', console.log);
      console.log("PUERTO --> ", port);
    if(port.port){
      
    }else{
      console.log("No abre ");
    }


  }

  busquedaEventBarCode(sCode: any) {
    this.busqueda = sCode;
    let obj = {
      target: {
        value: sCode
      }
    }
    this.buscarProducto(obj);
  }

  refresh() {
    this.productService.refreshProducts();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.ipcService.removeAllListeners("reply");
  }

  openModal(data?: any) {
    switch (this.modal) {
      case 'modalAgregarProducto':
        this.modalAgregarProducto = true;
        break;
      case 'modalLinea':
        this.modalLinea = true;
        break;
      case 'modalAgregarPaquete':
        this.modalAgregarPaquete = true;
        break;
      case 'modalPaquete':
        this.modalPaquete = true;
        break;
      case 'modalListaPrecios':
        this.modalListaPrecios = true;
        break;
    }
    if (data) {
      this.dataModal = data;
    } else {
      this.dataModal = {};
    }
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarProducto':
        this.modalAgregarProducto = false;
        break;
      case 'modalLinea':
        this.modalLinea = false;
        break;
      case 'modalAgregarPaquete':
        this.modalAgregarPaquete = false;
        break;
      case 'modalPaquete':
        this.modalPaquete = false;
        break;
      case 'modalListaPrecios':
        this.modalListaPrecios = false;
        break;
    }
    this.refresh();
    this.appService.eventInterface = this;
  }

  buscarProducto(event: any) {

    let listadoTemp: any[] = this.listadoCopia.filter((producto: any) => producto.codigo_barras.includes(event.target.value) || producto.nombre.includes(event.target.value));
    if (event.target.value == '') {
      this.listado = this.listadoCopia;
    } else {
      this.listado = listadoTemp;
    }
  }


  onTableClick(event: any, data: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    this.rightClickMenuItems = [
      {
        menuText: 'Editar',
        menuEvent: 'edit',
        menuId: data
      },
      {
        menuText: 'Eliminar',
        menuEvent: 'delete',
        menuId: data
      },
    ];
    this.createContextMenuComponent();
  }

  createContextMenuComponent() {
    this.container.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuComponent);
    const componentRef = this.container.createComponent(componentFactory);
    (<ContextMenuComponent>componentRef.instance).contextMenuEvent = this.menuEvent;
    (<ContextMenuComponent>componentRef.instance).contextMenuSelector = this.contextMenuSelector;
    (<ContextMenuComponent>componentRef.instance).contextMenuItems = this.rightClickMenuItems;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }

}

