import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { ProductService } from './services/product-service/product.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  displayStyleAddProduct = "none";
  displayStyleLine = "none";
  displayStyleAddPackage = "none";
  displayStylePackage = "none";
  displayStylePriceList = "none";

  dataProduct: any;

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
      case 'addProduct':
        this.displayStyleAddProduct = "block";
        break;
      case 'line':
        this.displayStyleLine = "block";
        break;
      case 'addPackage':
        this.displayStyleAddPackage = "block";
        break;
      case 'package':
        this.displayStylePackage = "block";
        break;
      case 'priceList':
        this.displayStylePriceList = "block";
        break;
    }
    if (data) {
      this.dataProduct = data;
    } else {
      this.dataProduct = {};
    }
  }

  displayStyleEvent(e: string) {
    switch (this.modal) {
      case 'addProduct':
        this.displayStyleAddProduct = e;
        break;
      case 'line':
        this.displayStyleLine = e;
        break;
      case 'addPackage':
        this.displayStyleAddPackage = e;
        break;
      case 'package':
        this.displayStylePackage = e;
        break;
      case 'priceList':
        this.displayStylePriceList = e;
        break;
    }
    this.dataProduct = {};
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
    (<ContextMenuComponent>componentRef.instance).service = this.productService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }



}

