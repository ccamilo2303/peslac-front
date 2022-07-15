import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { PackageService } from '../../services/package-service/package.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-package',
  templateUrl: './modal-package.component.html',
  styleUrls: ['./modal-package.component.scss']
})
export class ModalPackageComponent implements OnInit {

  modalAgregarPaquete:boolean = false;
  dataPackage: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;
  listado: any = [];
  listadoCopia: any = [];
  modal: string = '';
  loading: boolean = false;

  private querySubscription!: Subscription;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private packageService: PackageService, private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit(): void {

    this.querySubscription = this.packageService.getPackages()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.paquetes;
        this.listadoCopia = data.paquetes;
        console.log("Paquetes --> ", this.listadoCopia);
      });
      $("#modalPaquete").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  refresh() {
    this.packageService.refreshPackages();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalPaquete").modal('hide');
  }

  openModal(data?: number) {
    switch (this.modal) {
      case 'modalAgregarPaquete':
        this.modalAgregarPaquete = true;
        break;
    }
    if (data) {
      this.dataPackage = data;
    } else {
      this.dataPackage = {};
    }
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarPaquete':
        this.modalAgregarPaquete = false;
        break;
    }
    this.refresh();
  }

  buscarPaquete(event:any){
    let listadoTemp:any[] = this.listadoCopia.filter((paquete:any) => paquete.producto.codigo_barras.includes(event.target.value) || paquete.producto.nombre.includes(event.target.value));
    if(listadoTemp.length > 0){
      this.listado = listadoTemp;  
    }else{
      this.listado = this.listadoCopia;
    }
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
