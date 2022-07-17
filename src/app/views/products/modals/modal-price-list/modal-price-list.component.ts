import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { PackageService } from '../../services/package-service/package.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PriceListService } from '../../services/price-list-service/price-list.service';

declare var $: any;

@Component({
  selector: 'app-modal-price-list',
  templateUrl: './modal-price-list.component.html',
  styleUrls: ['./modal-price-list.component.scss']
})
export class ModalPriceListComponent implements OnInit, OnDestroy {

  modalAgregarListaPrecios:boolean = false  ;

  dataPriceList: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;
  listado: any = [];
  modal: string = '';

  loading: boolean = false;
  private querySubscription!: Subscription;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private priceListService: PriceListService, private packageService: PackageService, private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit(): void {
    

    
    this.querySubscription = this.priceListService.getProductList()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.lista_precios;
      });
      $("#modalListaPrecios").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  refresh() {
    this.priceListService.refreshProductList();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalListaPrecios").modal('hide');
  }

  openModal(data?: number) {
    switch (this.modal) {
      case 'modalAgregarListaPrecios':
        this.modalAgregarListaPrecios = true;
        break;
    }
    if (data) {
      this.dataPriceList = data;
    } else {
      this.dataPriceList = {};
    }
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarListaPrecios':
        this.modalAgregarListaPrecios = false;
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
