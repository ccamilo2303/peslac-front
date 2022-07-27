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

  public listado: any = [];
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
    
    this.querySubscription = this.priceListService.getDetailProductList(this.data.id ? this.data.id : -1)
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        
        console.log(" DATA --> ", data);
        this.listado = data.productos.map( (x:any) => {
          let obj = {...x, valor_nuevo : (x.detalle_lista_precios.length > 0 && x.detalle_lista_precios[0].precio_lista != null ? x.detalle_lista_precios[0].precio_lista : x.precio_venta) }
          
          return obj;
        });

        this.initForm();
      });

    $("#modalListaPrecios").modal('hide');
    $("#modalAgregarCliente").modal('hide');
    $("#modalAgregarListaPrecios").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  refresh() {
    //this.priceListService.refreshPackages();
  }

  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarListaPrecios").modal('hide');
    $("#modalListaPrecios").modal({ backdrop: 'static', keyboard: false, show: true });
    $("#modalAgregarCliente").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  submit() {
    
    if(this.data.id){
      this.actualizarLista();
    }else{
      this.crearLista();
    }

  }

  crearLista(){
    this.priceListService.postProductList(this.form.controls['nombre'].value).subscribe({
      next: (value:any)=>{
        this.data.id = value.data.insert_lista_precios.returning[0].id;
        this.actualizarLista();
      }
    })
  }

  actualizarLista(){
    let informacion = this.listado.map( (x:any) => {
      let obj = { id_lista_precio: this.data.id, id_producto: x.id, precio_lista: x.valor_nuevo }
      return obj;
    });


    this.priceListService.deleteDetailProductListConfiguration(this.data.id).subscribe({
      next: (value) => {
        this.priceListService.insertDetailProductListConfiguration(informacion).subscribe({
          next: (value) => {

            this.priceListService.updateProductListConfiguration(this.data.id, this.form.controls['nombre'].value).subscribe({
              next: (value) => {
                this.mensajeOk();
              }
            });
          },
          error: (err) => {
            this.mensajeError();
          }
        })
      },
      error: (err) => {
        this.mensajeError();
      }
    });
  }

  initForm() {

    if (this.data && this.data.id != null) {
      this.form.controls['nombre'].setValue(this.data.nombre);
      
      //this.listado = [this.data.producto];
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
