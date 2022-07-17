import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { ProductService } from './services/product-service/product.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';


declare var $: any;
declare var onScan: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy{

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

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private productService: ProductService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.productService.getProducts()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
        this.listadoCopia = data.productos;
        console.log("Productos --> ", data);
      });


      

  }

  refresh() {
    this.productService.refreshProducts();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
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
  }

  buscarProducto(consulta:any){
    console.log("Consulta: " + consulta);
    let listadoTemp:any[] = this.listadoCopia.filter((producto:any) => producto.codigo_barras.includes(consulta) || producto.nombre.includes(consulta));
    if(listadoTemp.length > 0){
      this.listado = listadoTemp;  
    }else{
      this.listado = this.listadoCopia;
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

