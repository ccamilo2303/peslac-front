import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { DevolucionesService } from '../../services/devoluciones.service';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

declare var $: any;

@Component({
  selector: 'app-modal-detalle-devolucion',
  templateUrl: './modal-detalle-devolucion.component.html',
  styleUrls: ['./modal-detalle-devolucion.component.scss']
})
export class ModalDetalleDevolucionComponent implements OnInit {

  dataModal!: any;
  listado: any = [];

  loading: boolean = false;
  modal: string = '';

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  private querySubscription!: Subscription;


  constructor(private devolucionesService: DevolucionesService, private appService: AppService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.querySubscription = this.devolucionesService.getDetalleVenta(this.data.id)
    .subscribe(({ data, loading }) => {
      this.loading = loading;
      this.listado = data.ventas;
      console.log("--> ", data);
    });

    $("#modalProveedor").modal({ backdrop: 'static', keyboard: false, show: true });

  }

  refresh() {
    this.devolucionesService.refreshHistorial();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }


}
