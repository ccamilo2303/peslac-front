import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { HistorialComprasService } from './services/historial-compras.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.scss']
})
export class HistorialComprasComponent implements OnInit, OnDestroy {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalDetalleCompra: boolean = false;
  modalAnularCompra: boolean = false;

  tipoVista = 1;

  form: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
  });

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private historialComprasService: HistorialComprasService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.initData();
  }

  refresh() {
    this.historialComprasService.refreshHistorial();
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
      case 'modalDetalleCompra':
        this.modalDetalleCompra = true;
        break;
      case 'modalAnularCompra':
        this.modalAnularCompra = true;
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
      case 'modalDetalleCompra':
        this.modalDetalleCompra = false;
        break;
      case 'modalAnularCompra':
        this.modalAnularCompra = false;
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
      },
      {
        menuText: 'Anular',
        menuEvent: 'delete',
        menuId: data,
        modalAnularCompra: true
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

  initData(fechaInicio?: any, fechaFin?: any) {
    if (this.tipoVista == 1) {
      this.querySubscription = this.historialComprasService.getHistorialComprasDetallado(fechaInicio, fechaFin)
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          this.listado = data.vis_detalle_compras;
          console.log("--> ", data);
        });
    } else {
      this.querySubscription = this.historialComprasService.getHistorialComprasGeneral(fechaInicio, fechaFin)
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          console.log("--> ", data);
          let compras: any[] = [];
          data.compras.forEach((compra: any) => {
            let total: any = 0;

            compra.ordene.detalle_ordenes.forEach((orden: any) => {
              total += orden.total;
            });
            let compraNueva = { ...compra, total: total };
            compras.push(compraNueva);
          });

          this.listado = compras;
          this.tipoVista = 3;
        });

    }
  }


}
