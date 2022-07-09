import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HistorialVentasService } from '../../services/historial-ventas.service';

@Component({
  selector: 'app-informe-ventas',
  templateUrl: './informe-ventas.component.html',
  styleUrls: ['./informe-ventas.component.scss']
})
export class InformeVentasComponent implements OnInit, OnDestroy {

  dataModal!: any;

  rightClickMenuItems: any = [];
  parentElem: any;
  contextMenuSelector: string = '';
  menuEvent: any;

  loading: boolean = false;
  modal: string = '';
  listado: any = [];
  private querySubscription!: Subscription;

  modalHistorial: boolean = false;
  modalSalida: boolean = false;
  modalDevolucion: boolean = false;

  form: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
  });

  dataGrafico = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Valor Ventas',
        backgroundColor: '#f87979',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };

  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container: any;

  constructor(private historialVentasService: HistorialVentasService) { }

  ngOnInit(): void {
    this.initData();
  }

  refresh() {
    this.historialVentasService.refreshHistorial();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  filtroFecha() {
    this.initData(this.form.controls["fechaInicio"].value, this.form.controls["fechaFin"].value);
  }

  addDataGrafico(mes:any, valor:any){
    console.log("precio: ", valor);
    switch(mes){
      case 'Enero':
        this.dataGrafico.datasets[0].data[0] += valor;
        break;
    }
  }

  openModal(data?: any) {

    switch (this.modal) {
      case 'historial':
        this.modalHistorial = true;
        break;
      case 'modalSalida':
        this.modalSalida = true;
        break;
      case 'modalDevolucion':
        console.log("Entra a mostrar modal..: ", this.modal);
        this.modalDevolucion = true;
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
      case 'historial':
        this.modalHistorial = false;
        break;
      case 'modalSalida':
        this.modalSalida = false;
        break;
      case 'modalDevolucion':
        this.modalDevolucion = false;
        break;
    }
    this.refresh();
  }


  initData(fechaInicio?: any, fechaFin?: any) {

    this.querySubscription = this.historialVentasService.getHistorialVentasDetallado(fechaInicio, fechaFin)
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.detalle_ordenes;
        console.log("--> ", data);

        data.detalle_ordenes.forEach((venta:any) => {
          this.addDataGrafico('Enero', venta.total);
        });
      });

  }

}
