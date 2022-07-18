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
  meses: any = [];
  totalMeses: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  private querySubscription!: Subscription;

  modalHistorial: boolean = false;
  modalSalida: boolean = false;
  modalDevolucion: boolean = false;

  form: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
  });

  dataGrafico = {
    labels: this.meses,
    datasets: [
      {
        label: 'Valor Ventas',
        backgroundColor: '#f87979',
        data: this.totalMeses
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

  addDataGrafico(mes: any, valor: any) {
    console.log("precio: ", valor);
    switch (mes) {
      case 'Enero':
        this.meses[0] = mes;
        this.totalMeses[0] += valor;
        break;
      case 'Febrero':
        this.meses[1] = mes;
        this.totalMeses[1] += valor;
        break;
      case 'Marzo':
        this.meses[2] = mes;
        this.totalMeses[2] += valor;
        break;
      case 'Abril':
        this.meses[3] = mes;
        this.totalMeses[3] += valor;
        break;
      case 'Mayo':
        this.meses[4] = mes;
        this.totalMeses[4] += valor;
        break;
      case 'Junio':
        this.meses[5] = mes;
        this.totalMeses[5] += valor;
        break;
      case 'Julio':
        this.meses[6] = mes;
        this.totalMeses[6] += valor;
        break;
      case 'Agosto':
        this.meses[7] = mes;
        this.totalMeses[7] += valor;
        break;
      case 'Septiembre':
        this.meses[8] = mes;
        this.totalMeses[8] += valor;
        break;
      case 'Octubre':
        this.meses[9] = mes;
        this.totalMeses[9] += valor;
        break;
      case 'Noviembre':
        this.meses[10] = mes;
        this.totalMeses[10] += valor;
        break;
      case 'Diciembre':
        this.meses[11] = mes;
        this.totalMeses[11] += valor;
        break;
    }
    console.log(this.meses);
    console.log(this.totalMeses);
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

        data.detalle_ordenes.forEach((venta: any) => {
          this.addDataGrafico('Enero', venta.total);
        
        });
      });

  }

}
