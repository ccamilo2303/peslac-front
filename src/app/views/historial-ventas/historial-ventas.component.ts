import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from './services/historial-ventas.service';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.scss']
})
export class HistorialVentasComponent implements OnInit, OnDestroy {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  listadoCopia: any = [];

  private querySubscription!: Subscription;

  modalDetalleVenta: boolean = false;
  modalAnularVenta: boolean = false;
  modalDevolucion: boolean = false;

  tipoVista = 1;

  form: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
  });

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private historialVentasService: HistorialVentasService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.initData();
  }

  refresh() {
    this.historialVentasService.refreshHistorial();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  cambiarVista(event: any) {
    this.tipoVista = event.target.value
  }

  filtroFecha() {
    this.initData(this.form.controls["fechaInicio"].value, this.form.controls["fechaFin"].value);
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'modalDetalleVenta':
        this.modalDetalleVenta = true;
        break;
      case 'modalAnularVenta':
        this.modalAnularVenta = true;
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
      case 'modalDetalleVenta':
        this.modalDetalleVenta = false;
        break;
      case 'modalAnularVenta':
        this.modalAnularVenta = false;
        break;
    }
    this.refresh();
  }

  buscarVenta(event: any) {
    console.log("LISTADO COPIA --> " , this.listadoCopia);
    if (this.tipoVista == 1) {
      let listadoTemp: any[] = this.listadoCopia.filter((venta: any) => venta.ordene.id.toString().includes(event.target.value) || venta.ordene.cliente.nombres.includes(event.target.value) || venta.ordene.cliente.apellidos.includes(event.target.value));
      if (event.target.value == '') {
        this.listado = this.listadoCopia;
      } else {
        this.listado = listadoTemp;
      }
    } else {
      let listadoTemp:any[] = this.listadoCopia.filter((venta:any) => venta.id.toString().includes(event.target.value) || venta.ordene.cliente.nombres.includes(event.target.value) || venta.ordene.cliente.apellidos.includes(event.target.value));
      if(event.target.value == ''){
        this.listado = this.listadoCopia;
      }else{
        this.listado = listadoTemp;
      }
    }

  }

  onTableClick(event: any, data: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    if (this.tipoVista == 1) {
      this.rightClickMenuItems = [
        {
          menuText: 'Ver',
          menuEvent: 'edit',
          menuId: data,
        }
      ];
    } else {
      this.rightClickMenuItems = [
        {
          menuText: 'Ver',
          menuEvent: 'edit',
          menuId: data,
        },
        {
          menuText: 'Anular',
          menuEvent: 'delete',
          menuId: data,
          modalAnularVenta: true
        },
      ];
    }

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

  initData(fechaInicio?: any, fechaFin?: any) {
    if (this.tipoVista == 1) {
      this.querySubscription = this.historialVentasService.getHistorialVentasDetallado(fechaInicio, fechaFin)
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          this.listado = data.detalle_ordenes;
          this.listadoCopia = data.detalle_ordenes;
          console.log("--> ", data);
        });
    } else {
      this.querySubscription = this.historialVentasService.getHistorialVentasGeneral(fechaInicio, fechaFin)
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          console.log("--> ", data);
          let ventas: any[] = [];
          data.ventas.forEach((venta: any) => {
            let total: any = 0;

            venta.ordene.detalle_ordenes.forEach((orden: any) => {
              total += orden.total;
            });
            let ventaNueva = { ...venta, total: total };
            ventas.push(ventaNueva);
          });

          this.listado = ventas;
          this.listadoCopia = ventas;
          this.tipoVista = 3;
        });

    }
  }

}
