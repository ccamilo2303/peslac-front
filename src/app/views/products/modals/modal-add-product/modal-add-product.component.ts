import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductService } from '../../services/product-service/product.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-add-product',
  templateUrl: './modal-add-product.component.html',
  styleUrls: ['./modal-add-product.component.scss']
})

export class ModalAddProductComponent implements OnInit, OnDestroy {

  @Input()
  public displayStyle: string = '';

  @Input()
  public dataProducto: any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  public tiposUsuarios!:any;
  private querySubscription!: Subscription;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    type_product: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    iva: new FormControl('', [Validators.required]),
    supplier: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    image_url: new FormControl('', [Validators.required]),
    state_product: new FormControl('', [Validators.required]),
    inventary_min: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
  });

  constructor(private productService: ProductService, private appService: AppService) { }

  ngOnInit(): void {
    this.initForm();
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

    if(!this.dataProducto.id){
      this.productService.createProduct(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
     
      this.productService.editProduct(this.form.value, this.dataProducto.id)
      .subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });
  
    }
   
  }

  initForm() {

    this.querySubscription = this.appService.getTiposUsuarios().subscribe(({ data, loading }) => {
      this.tiposUsuarios = data.tipos_usuarios;
    });

    if (this.dataProducto.id != null) {
      this.form.setValue({
        name: this.dataProducto.name,
        quantity: this.dataProducto.quantity,
        type_product: this.dataProducto.type_product,
        price: this.dataProducto.price,
        iva: this.dataProducto.iva,
        supplier: this.dataProducto.supplier,
        description: this.dataProducto.description,
        type: this.dataProducto.type,
        image_url: this.dataProducto.image_url,
        state_product: this.dataProducto.state_product,
        inventary_min: this.dataProducto.inventary_min,
        code: this.dataProducto.code,
      });
    }

  }

}
