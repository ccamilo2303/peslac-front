import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from '../../services/historial-ventas.service';

@Component({
  selector: 'app-historial-anulados',
  templateUrl: './historial-anulados.component.html',
  styleUrls: ['./historial-anulados.component.scss']
})
export class HistorialAnuladosComponent implements OnInit {


  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalDetalleVenta: boolean = false;

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

  filtroFecha() {
    this.initData(this.form.controls["fechaInicio"].value, this.form.controls["fechaFin"].value);
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'modalDetalleVenta':
        this.modalDetalleVenta = true;
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
    }
    this.refresh();
  }

  onTableClick(event: any, data: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    this.rightClickMenuItems = [
      {
        menuText: 'Ver',
        menuEvent: 'edit',
        menuId: data,
      }
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

  initData(fechaInicio?: any, fechaFin?: any) {

    this.querySubscription = this.historialVentasService.getHistorialVentasAnuladas(fechaInicio, fechaFin)
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        console.log("--> ", data);

        let ventas: any[] = [];
        data.ventas_anuladas.forEach((venta: any) => {
          let total: any = 0;

          venta.venta.ordene.detalle_ordenes.forEach((orden: any) => {
            total += orden.total;
          });
          let ventaNueva = { ...venta, total: total };
          ventas.push(ventaNueva);
        });

        this.listado = ventas;

      });

  }

}
