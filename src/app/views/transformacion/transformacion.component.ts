import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { TransformacionService } from './services/transformacion.service';

@Component({
  selector: 'app-transformacion',
  templateUrl: './transformacion.component.html',
  styleUrls: ['./transformacion.component.scss']
})
export class TransformacionComponent implements OnInit {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalAgregarTransformacion: boolean = false;

  form: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
  });

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private transformacionService: TransformacionService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.initData();
  }

  refresh() {
    this.transformacionService.refreshHistorial();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  filtroFecha() {
    this.initData(this.form.controls["fechaInicio"].value, this.form.controls["fechaFin"].value);
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'modalAgregarTransformacion':
        this.modalAgregarTransformacion = true;
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
      case 'modalAgregarTransformacion':
        this.modalAgregarTransformacion = false;
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
        menuId: data,
      },
      {
        menuText: 'Eliminar',
        menuEvent: 'delete',
        menuId: data,
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

    this.querySubscription = this.transformacionService.getHistorialVentasDetallado(fechaInicio, fechaFin)
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.detalle_ordenes;
        console.log("--> ", data);
      });

  }

}
