import { Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContextMenuComponent } from '@docs-components/context-menu/context-menu.component';

import { DiscountService } from '../../services/discount.service';
import { Product } from '../../response-types/product';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-discount',
  templateUrl: './modal-discount.component.html',
  styleUrls: ['./modal-discount.component.scss']
})
export class ModalDiscountComponent implements OnInit {

  displayStyleAddDiscount = "none";
  data: Product = new Product();

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  modal:string = '';

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private discountService: DiscountService, private componentFactoryResolver: ComponentFactoryResolver) { }

  public listado: Product[] = [
    {
      id: 1,
      name: "Mantequilla",
      quantity: 200,
      type_product: "GR",
      price: 2000,
      iva: "Si",
      supplier: "avianca",
      description: "",
      type: "Normal",
      image_url: "",
      state_product: false,
      inventary_min: false,
      code: "123456789",
    }
  ];

  ngOnInit(): void {
    this.initData();
  }

  @Input()
  public displayStyle: string = '';

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.displayStyleEvent.emit(this.displayStyle);
  }

  initData() {

    this.discountService.getDiscounts().subscribe({
      complete: () => {
        let results = <Product[]>this.listado;
        results.forEach(x => {
          this.listado.push(x);
        });
      },
      error: (err: Error) => {
        Swal.fire({
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
        })
      }
    })

  }

  openModal(data?: number) {
    switch (this.modal) {
      case 'addDiscount':
        this.displayStyleAddDiscount = "block";
        break;
    }
    if (data) {
      let product: any = this.listado.find(product => product.id === data);
      this.data = product;
    } else {
      this.data = new Product();
    }
  }

  displayStyleEvent2(e: string) {
    switch (this.modal) {
      case 'addDiscount':
        this.displayStyleAddDiscount = e;
        break;
    }
    this.data = new Product();
  }

  onTableClick(event: any) {
    this.modal = event.path[1].attributes.modal.nodeValue;
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;
    this.rightClickMenuItems = [
      {
        menuText: 'Editar',
        menuEvent: 'edit',
        menuId: Number(event.path[1].id)
      },
      {
        menuText: 'Eliminar',
        menuEvent: 'delete',
        menuId: Number(event.path[1].id)
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
    (<ContextMenuComponent>componentRef.instance).service = this.discountService;
    (<ContextMenuComponent>componentRef.instance).component = this;
  }

}
