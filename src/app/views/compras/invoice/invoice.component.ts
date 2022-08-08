import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PrintService} from '../services/print.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  invoiceIds: string[];
  invoiceDetails!: Promise<any>[];

  constructor(route: ActivatedRoute,
              private printService: PrintService) {
    this.invoiceIds = route.snapshot.params['invoiceIds']
      .split(',');
  }

  ngOnInit() {
    console.log("Entra aquiiiiiii");
    this.invoiceDetails = this.invoiceIds
      .map(id => this.getInvoiceDetails(id));
    Promise.all(this.invoiceDetails)
      .then(() => this.printService.onDataReady());
  }

  getInvoiceDetails(invoiceId:any) {
    const amount = Math.floor((Math.random() * 100));
    return new Promise(resolve =>
      setTimeout(() => resolve({amount}), 1000)
    );
  }

}
