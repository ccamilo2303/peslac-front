import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { PackageService } from '../../services/package-service/package.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-price-list',
  templateUrl: './modal-price-list.component.html',
  styleUrls: ['./modal-price-list.component.scss']
})
export class ModalPriceListComponent implements OnInit {

  displayStyleAddPriceList = "none";

  dataPriceList: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;
  listado: any = [];
  modal: string = '';

  loading: boolean = false;
  private querySubscription!: Subscription;

  @Input()
  public displayStyle: string = '';

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private packageService: PackageService, private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit(): void {

    this.querySubscription = this.packageService.getPackages()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.paquetes;
      });

  }

  refresh() {
    this.packageService.refreshPackages();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.displayStyle = "none";
    this.displayStyleEvent.emit(this.displayStyle);
  }

  openModal(data?: number) {
    switch (this.modal) {
      case 'addPriceList':
        this.displayStyleAddPriceList = "block";
        break;
    }
    if (data) {
      this.dataPriceList = data;
    } else {
      this.dataPriceList = {};
    }
  }

  displayStyleEvent2(e: string) {
    switch (this.modal) {
      case 'addPriceList':
        this.displayStyleAddPriceList = e;
        break;
    }
    this.dataPriceList = {};
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
    (<ContextMenuComponent>componentRef.instance).service = this.packageService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }

}
