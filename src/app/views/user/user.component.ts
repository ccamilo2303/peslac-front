import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { UserService } from './services/user.service';
import { ContextMenuComponent } from '../../../components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy  {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];

  modalAgregarUsuario: boolean = false;

  private querySubscription!: Subscription;


  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;



  constructor(private userService: UserService, private componentFactoryResolver: ComponentFactoryResolver) {
    
   }

  
  
  ngOnInit(): void {
   
    this.querySubscription = this.userService.getUsers()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.usuarios;
      });

  }

  refresh() {
    this.userService.refreshUsers();
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
 
  openModal(data?:any) {
    switch (this.modal) {
      case 'modalAgregarUsuario':
        this.modalAgregarUsuario = true;
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
      case 'modalAgregarUsuario':
        this.modalAgregarUsuario = false;
        break;
    }
    this.refresh();
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
    (<ContextMenuComponent>componentRef.instance).component = this;
  }


}

