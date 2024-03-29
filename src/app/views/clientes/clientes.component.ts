import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { ClientesService } from './services/clientes.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

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

  modalProveedores:boolean = false;
  
  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private clientesService:ClientesService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  
    this.querySubscription = this.clientesService.getClientes()
    .subscribe(({ data, loading }) => {
      this.loading = loading;
      this.listado = data.clientes;
      this.listadoCopia = data.clientes;
      console.log("--> ", data);
    });

  }

  refresh() {
    this.clientesService.refreshClientes();
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
    this.dataModal = data;
    console.log("Entra a mostrar modal..: ", data);
    this.modalProveedores = true;
  }

  closeEventModal(){
    this.modalProveedores = false;
    this.refresh();
  }

  buscarCliente(event:any){
    //console.log("Consulta: " + event.target.value);
    let listadoTemp:any[] = this.listadoCopia.filter((cliente:any) => cliente.cedula.includes(event.target.value));
    if(event.target.value == ''){
      this.listado = this.listadoCopia;
    }else{
      this.listado = listadoTemp;  
    }
  }

  onTableClick(event: any, data:any) {
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
    //(<ContextMenuComponent>componentRef.instance).service = this.productService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }



}

