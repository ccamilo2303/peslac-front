import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { ProveedoresService } from './services/proveedores.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

  displayStyleAddProduct = "none";
  displayStyleGroup = "none";
  displayStyleDiscount = "none";
  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalProveedores:boolean = false;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private proveedoresService:ProveedoresService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  
    this.querySubscription = this.proveedoresService.getProveedores()
    .subscribe(({ data, loading }) => {
      this.loading = loading;
      this.listado = data.proveedores;
      console.log("--> ", data);
    });

  }

  refresh() {
    this.proveedoresService.refreshProducts();

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


  displayStyleEvent(e: string) {
    switch (this.modal) {
      case 'addProduct':
        this.displayStyleAddProduct = e;
        break;
      case 'group':
        this.displayStyleGroup = e;
        break;
      case 'discount':
        this.displayStyleDiscount = e;
        break;
    }
    this.dataModal = {};
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

