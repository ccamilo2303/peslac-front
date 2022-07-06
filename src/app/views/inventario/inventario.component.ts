import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { InventarioService } from './services/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalProveedores: boolean = false;
  modalSalida: boolean = false;
  modalDevolucion: boolean = false;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private inventarioService: InventarioService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.inventarioService.getInventario()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
        console.log("--> ", data);
      });

  }

  refresh() {
    this.inventarioService.refreshClientes();

  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'historialDevoluciones':
        this.modalProveedores = true;
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
      case 'historialDevoluciones':
        this.modalProveedores = true;
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
