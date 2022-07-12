import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { PriceListService } from '../../services/price-list-service/price-list.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-modal-add-price-list',
  templateUrl: './modal-add-price-list.component.html',
  styleUrls: ['./modal-add-price-list.component.scss']
})
export class ModalAddPriceListComponent implements OnInit, OnDestroy {

  listado: any = [];
  loading: boolean = false;
  private querySubscription!: Subscription;

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private priceListService: PriceListService, private productService: ProductService) { }

  ngOnInit(): void {
    this.initForm();
    $("#modalListaPrecios").modal('hide');
    $("#modalAgregarCliente").modal('hide');
    $("#modalAgregarListaPrecios").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  
  refresh() {
    this.priceListService.refreshPackages();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarListaPrecios").modal('hide');
    $("#modalListaPrecios").modal({ backdrop: 'static', keyboard: false, show: true });
    $("#modalAgregarCliente").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  submit() {
   
    this.priceListService.editPackage(this.form.value, this.data.id).subscribe(({ data }) => {
      this.mensajeOk();
      this.refresh();
    }, (error) => {
      this.mensajeError();
    });

  }

  initForm() {

    if (this.data && this.data.id != null) {
      console.log("Lista: " , this.data);
      this.form.controls['nombre'].setValue(this.data.nombre); 
      this.listado = [this.data.producto];
    }else{
      this.querySubscription = this.productService.getProducts()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
      });
      
    }

  }

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModal();
      }
    });
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
