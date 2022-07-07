import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from './services/historial-ventas.service';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.scss']
})
export class HistorialVentasComponent implements OnInit {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalHistorial: boolean = false;
  modalSalida: boolean = false;
  modalDevolucion: boolean = false;

  tipoVista = 1;

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private historialVentasService: HistorialVentasService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void { 
    this.initData();
  }

  refresh() {
    this.historialVentasService.refreshInventario();

  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  cambiarVista(event:any){
    this.tipoVista = event.target.value
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'historial':
        this.modalHistorial = true;
        break;
      case 'modalSalida':
        this.modalSalida = true;
        break;
      case 'modalDevolucion':
        console.log("Entra a mostrar modal..: ", this.modal);
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
      case 'historial':
        this.modalHistorial = false;
        break;
      case 'modalSalida':
        this.modalSalida = false;
        break;
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
    this.rightClickMenuItems = [
      {
        menuText: 'Devolución por error',
        menuEvent: 'edit',
        menuId: data,
        modalDevolucion: true
      },
      {
        menuText: 'Salida por error',
        menuEvent: 'delete',
        menuId: data,
        modalSalida: true
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
    //(<ContextMenuComponent>componentRef.instance).service = this.productService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }

  initData(){
    if(this.tipoVista == 1){
      this.querySubscription = this.historialVentasService.getHistorialVentasDetallado()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.detalle_ordenes;
        console.log("--> ", data);
      });
    }else{
      this.querySubscription = this.historialVentasService.getHistorialVentasGeneral()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.ventas;
        console.log("--> ", data);
        data.ventas.forEach((venta:any) => {
          let total:any = 0;
          venta.ordene.detalle_ordenes.forEach((orden:any) => {
            total += orden.total;
          });
          console.log("total: ", total);
          let obj:any = {total: total};

          console.log(venta.ordene.detalle_ordenes);
          venta.ordene.detalle_ordenes = [obj]
          //console.log(venta.ordene.detalle_ordenes = [{}]);
        });
        this.tipoVista = 3;
      });
      
    }
  }

}
