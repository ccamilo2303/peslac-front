import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from '../../services/historial-ventas.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

declare var $: any;

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.scss']
})
export class ModalDetalleVentaComponent implements OnInit, OnDestroy {
  
  dataModal!: any;
  listado: any = [];

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';

  modalDevolucion: boolean = false;

  @Input()
  public data: any;

  @Input()
  public anulado: any = false;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  private querySubscription!: Subscription;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private historialVentasService: HistorialVentasService, private appService: AppService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.historialVentasService.getDetalleVenta(this.data.id)
    .subscribe(({ data, loading }) => {
      this.loading = loading;
      this.listado = data.ventas;
      
      let ventas:any[] = [];
      data.ventas.forEach((venta:any)=>{
        let total:any = 0;

        venta.ordene.detalle_ordenes.forEach((orden:any) => {
          total += orden.total;
        });
        let ventaNueva = {...venta, total:total};
        ventas.push(ventaNueva);
      });

      this.listado = ventas;
      console.log("--> ", this.listado);
    });

    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });

  }

  refresh() {
    this.historialVentasService.refreshHistorial();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }

  openModal(data?: any) {
    switch (this.modal) {
      case 'modalDevolucion':
        this.modalDevolucion = true;
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
      case 'modalDevolucion':
        this.modalDevolucion = false;
        break;
    }
    this.refresh();
  }

  onTableClick(event: any, data: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    if(!this.anulado){
      this.rightClickMenuItems = [
        {
          menuText: 'Editar',
          menuEvent: 'edit',
          menuId: data,
        }
      ];
      this.createContextMenuComponent();
    }

    
  }

  createContextMenuComponent() {
    this.container.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuComponent);
    const componentRef = this.container.createComponent(componentFactory);
    (<ContextMenuComponent>componentRef.instance).contextMenuEvent = this.menuEvent;
    (<ContextMenuComponent>componentRef.instance).contextMenuSelector = this.contextMenuSelector;
    (<ContextMenuComponent>componentRef.instance).contextMenuItems = this.rightClickMenuItems;
    //(<ContextMenuComponent>componentRef.instance).service = this.productService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }


}
