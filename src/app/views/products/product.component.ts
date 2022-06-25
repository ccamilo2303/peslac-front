import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { ProductService } from './services/product.service';
import { Product } from './response-types/product';
import { ContextMenuComponent } from './context-menu/context-menu/context-menu.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  displayStyle = "none";
  editUser = false;
  dataUser:Product[] = [];

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  public listado: Product[] = [
    {
      id: 1,
      name: "Andrés Ricardo",
      last_name: "Beltrán Sarta",
      cel_phone: "3138646727",
      city: "Bogotá",
      document_number: "1234567890",
      role: "Administrador",
      id_type_user: "Administrador"
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

    this.productService.getUsers().subscribe({
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

  openModal(data?:Product) {
    this.displayStyle = "block";
    if(data){
      console.log("VIENE DATA: " , data);
      this.editUser = true;
      this.dataUser.push(data);
      console.log("VIENE DATA2: " , this.dataUser);
    }
  }

  displayStyleEvent(e: string) {
    this.displayStyle = e;
  }

  onTableClick(event: any) {
    console.log(event.path[1].id);
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    this.rightClickMenuItems = [
      {
        menuText: 'Editar',
        menuEvent: 'editUser()',
        menuId: event.path[1].id
      },
      {
        menuText: 'Eliminar',
        menuEvent: 'deleteUser()',
        menuId: event.path[1].id
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
  }



}

