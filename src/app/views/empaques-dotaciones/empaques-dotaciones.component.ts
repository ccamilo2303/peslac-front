import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { ProductService } from './services/product.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-empaques-dotaciones',
  templateUrl: './empaques-dotaciones.component.html',
  styleUrls: ['./empaques-dotaciones.component.scss']
})
export class EmpaquesDotacionesComponent implements OnInit, OnDestroy {

  modalAgregarProducto: boolean = false;

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private productService: ProductService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.productService.getProducts()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
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
    }
    this.refresh();
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
