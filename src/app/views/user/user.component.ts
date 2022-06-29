import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { UserService } from './services/user.service';
import { User } from './response-types/user';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  displayStyle = "none";
  dataUser:User = new User();

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  public listado: User[] = [
    {
      id: 1,
      name: "Andrés Ricardo",
      last_name: "Beltrán Sarta",
      document_number: "1234567890",
      city: "Bogotá",
      role: "Administrador",
      email: "cbeltran@excelcredit.co",
      direction: "Calle 67",
      cel_phone: "3138646727",
      user: "crick120",
      password: "213443",
      id_type_user: "Administrador",

      

    }
  ];

  constructor(private userService: UserService, private componentFactoryResolver: ComponentFactoryResolver) {
    
   }

  
  
  ngOnInit(): void {
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

    this.userService.getUsers().subscribe({
      complete: () => {
        let results = <User[]>this.listado;
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

  openModal(data?:number) {
    this.displayStyle = "block";
    if(data){
      let user:any = this.listado.find( user => user.id ===  data );
      this.dataUser = user;
    }else{
      this.dataUser = new User();
    }
  }

  displayStyleEvent(e: string) {
    this.displayStyle = e;
    this.dataUser = new User();
  }

  onTableClick(event: any) {
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
    (<ContextMenuComponent>componentRef.instance).service = this.userService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }



}

