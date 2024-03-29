import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { LineService } from '../../services/line-service/line.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-line',
  templateUrl: './modal-line.component.html',
  styleUrls: ['./modal-line.component.scss']
})
export class ModalLineComponent implements OnInit, OnDestroy {

  modalAgregarLinea: boolean = false;
  dataLine: any;

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

  constructor(private lineService: LineService, private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit(): void {

    this.querySubscription = this.lineService.getLines()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.lineas_producto;
        console.log("Lineas --> ",this.listado);
      });
    $("#modalLinea").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  refresh() {
    this.lineService.refreshLines();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  submit() {

    let validacionLinea: any[] = this.listado.filter((linea: any) => linea.nombre == this.form.controls["nombre"].value);

    if (validacionLinea.length > 0) {
      this.mensajeErrorValidacion("El nombre ingresado para crear la línea ya existe");
      return;
    }

    this.lineService.createLine(this.form.value).subscribe(({ data }) => {
      this.mensajeOk();
      this.refresh();
    }, (error) => {
      this.mensajeError();
    });

  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalLinea").modal('hide');
  }


  openModal(data?: number) {
    switch (this.modal) {
      case 'modalAgregarLinea':
        this.modalAgregarLinea = true;
        break;
    }
    if (data) {
      this.dataLine = data;
    } else {
      this.dataLine = {};
    }
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarLinea':
        this.modalAgregarLinea = false;
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

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    })
    this.form.reset();
  }

  private mensajeError() {
    Swal.fire({
      title: 'Error guardando la información',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  private mensajeErrorValidacion(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
