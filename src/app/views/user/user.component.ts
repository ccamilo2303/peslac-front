import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { UserService } from './services/user.service';
import { User } from './response-types/user';
import { ContextMenuComponent } from '../../../components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy  {

  displayStyle = "none";
  dataUser:User = new User();

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  listado: any = [];
  private querySubscription!: Subscription;


  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;



  constructor(private userService: UserService, private componentFactoryResolver: ComponentFactoryResolver) {
    
   }

  
  
  ngOnInit(): void {

    
    this.querySubscription = this.userService.getUsers()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.usuarios;
        console.log("Listado de usuarios: ", data.usuarios);
      });

  }

  refresh() {
    this.userService.refreshUsers();

  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }


  
  openModal(data?:any) {
    this.displayStyle = "block";
    if(data){
      this.dataUser = data;
    }else{
      this.dataUser = {};
    }
  }

  displayStyleEvent(e: string) {
    this.displayStyle = e;
    this.dataUser = new User();
  }

  onTableClick(event: any, data:any) {
    
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
    (<ContextMenuComponent>componentRef.instance).service = this.userService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }



}

