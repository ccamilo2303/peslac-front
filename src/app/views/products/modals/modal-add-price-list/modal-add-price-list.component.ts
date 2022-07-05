import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { PriceListService } from '../../services/price-list-service/price-list.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
  public displayStyle: string = '';

  @Input()
  public dataPriceList: any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private priceListService: PriceListService, private productService: ProductService) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  refresh() {
    this.priceListService.refreshPackages();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {
   
    this.priceListService.editPackage(this.form.value, this.dataPriceList.id).subscribe(({ data }) => {
      console.log('got data', data);
      this.refresh();
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

  initForm() {

    if (this.dataPriceList.id != null) {
      console.log("Lista: " , this.dataPriceList);
      this.form.controls['nombre'].setValue(this.dataPriceList.nombre); 
      this.listado = [this.dataPriceList.producto];
    }else{
      this.querySubscription = this.productService.getProducts()
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.productos;
      });
      
    }

  }



}
