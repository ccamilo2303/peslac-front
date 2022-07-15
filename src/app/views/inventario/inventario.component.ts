import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { InventarioService } from './services/inventario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit, OnDestroy {

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

  modalHistorial: boolean = false;
  modalSalida: boolean = false;
  modalDevolucion: boolean = false;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private inventarioService: InventarioService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.inventarioService.getInventario()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
        this.listadoCopia = data.productos;
        console.log("--> ", data);
      });

  }

  refresh() {
    this.inventarioService.refreshInventario();
  }

  recargar(){
    Swal.fire({
      title: 'Actualizando...',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    this.refresh();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'historial':
        this.modalHistorial = true;
        break;
      case 'modalSalida':
        this.modalSalida = true;
        break;
      case 'modalDevolucion':
        console.log("Entra a mostrar modal..: ", this.modal);
        this.modalDevolucion = true;
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
      case 'historial':
        this.modalHistorial = false;
        break;
      case 'modalSalida':
        this.modalSalida = false;
        break;
      case 'modalDevolucion':
        this.modalDevolucion = false;
        break;
    }
    this.refresh();
  }

  buscarProducto(event:any){
    //console.log("Consulta: " + event.target.value);
    let listadoTemp:any[] = this.listadoCopia.filter((producto:any) => producto.codigo_barras.includes(event.target.value) || producto.nombre.includes(event.target.value));
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
        menuText: 'Devolución por error',
        menuEvent: 'edit',
        menuId: data,
        modalDevolucion: true
      },
      {
        menuText: 'Salida por error',
        menuEvent: 'delete',
        menuId: data,
        modalSalida: true
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
    //(<ContextMenuComponent>componentRef.instance).service = this.productService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }


}
