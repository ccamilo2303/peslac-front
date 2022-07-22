import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';

declare var $: any;

@Component({
  selector: 'app-modal-balanza',
  templateUrl: './modal-balanza.component.html',
  styleUrls: ['./modal-balanza.component.scss']
})
export class ModalBalanzaComponent implements OnInit {

  @Output()
  public peso = new EventEmitter<number>();

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  pesoCalculado:any;

  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {

    $("#modalBalanza").modal({ backdrop: 'static', keyboard: false, show: true });

    console.log("VA A LEER");
    const port = new this.ipcService.serialPort.SerialPort({ path: 'COM4', baudRate: 9600 });
    const parser = new this.ipcService.serialPort.ReadlineParser();
    port.pipe(parser);
    parser.on('data', console.log);
    port.write('ROBOT PLEASE RESPOND\n');
    //parser.off('data', console.log);
    console.log("PUERTO --> ", port);
    if (port.port) {

    } else {
      console.log("No abre :(");
    }
  }

  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.peso.emit(1);
    this.closeEvent.emit(true);
    $("#modalBalanza").modal('hide');
  }


  submit() {

  }


}
