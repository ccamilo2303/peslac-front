import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { ProductService } from './services/product.service';
import { Product } from './response-types/product';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  displayStyleAddProduct = "none";
  displayStyleGroup = "none";
  dataUser: Product = new Product();

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  modal:string = '';

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  public listado: Product[] = [
    {
      id: 1,
      name: "Mantequilla",
      quantity: 200,
      type_product: "GR",
      price: 2000,
      iva: "Si",
      supplier: "avianca",
      description: "",
      type: "Normal",
      image_url: "",
      state_product: false,
      inventary_min: false,
      code: "123456789",
    }
  ];

  constructor(private productService: ProductService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    console.log('petticion get user');
    this.initData();
    /*this.userService.getUsers().subscribe(res => {
      let results = <User[]>res;
      results.forEach(x => {
        this.listado.push(x);
      });
    }, err => {
      if (err.status == 401) {
        console.log(err);
      }
    });*/

  }

  initData() {

    this.productService.getProducts().subscribe({
      complete: () => {
        let results = <Product[]>this.listado;
        results.forEach(x => {
          this.listado.push(x);
        });
      },
      error: (err: Error) => {
        Swal.fire({
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
        })
      }
    })

  }

  openModal(data?: number) {
    switch (this.modal) {
      case 'addProduct':
        this.displayStyleAddProduct = "block";
        break;
      case 'group':
        this.displayStyleGroup = "block";
        console.log("GRUPOOOO");
        break;
    }
    if (data) {
      let product: any = this.listado.find(product => product.id === data);
      this.dataUser = product;
    } else {
      this.dataUser = new Product();
    }
  }

  displayStyleEvent(e: string) {
    switch (this.modal) {
      case 'addProduct':
        this.displayStyleAddProduct = e;
        break;
      case 'group':
        this.displayStyleGroup = e;
        break;
    }
    this.dataUser = new Product();
  }

  onTableClick(event: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    this.rightClickMenuItems = [
      {
        menuText: 'Editar',
        menuEvent: 'edit',
        menuId: Number(event.path[1].id)
      },
      {
        menuText: 'Eliminar',
        menuEvent: 'delete',
        menuId: Number(event.path[1].id)
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

