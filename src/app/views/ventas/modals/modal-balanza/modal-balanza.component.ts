import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;

var port:any;
var parser:any;

@Component({
  selector: 'app-modal-balanza',
  templateUrl: './modal-balanza.component.html',
  styleUrls: ['./modal-balanza.component.scss']
})
export class ModalBalanzaComponent implements OnInit, OnDestroy {

  @Output()
  public peso = new EventEmitter<number>();
  
  @Output()
  public closeEvent = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    peso: new FormControl({ value: 'Calculando...', disabled: true }, [Validators.required]),
  });

  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {
    
    $("#modalBalanza").modal({ backdrop: 'static', keyboard: false, show: true });

    console.log("VA A LEER");
    port = new this.ipcService.serialPort.SerialPort({ path: 'COM4', baudRate: 9600 });
    parser = new this.ipcService.serialPort.ReadlineParser();
    port.pipe(parser);
    parser.on('data', (data:any) => {
      let peso = data;
      peso = peso.slice(7);
      this.form.controls['peso'].setValue(peso);
    });
    port.write('ROBOT PLEASE RESPOND\n');
    //parser.off('data', console.log);
    console.log("PUERTO --> ", port.port);
    if (port.port?.openOptions.hupcl) {
      console.log("Abre");
    } else {
      console.log("No abre :(");
    }

  }

  ngOnDestroy() {
    console.log("Destruye listener port");
    port.close( (err:any) => {
      console.log('port closed', err);
  });
  }

  closeModal() {
    this.closeEvent.emit(true);
    $("#modalBalanza").modal('hide');
  }

  submit() {
    let x = this.form.get("peso")?.value
    x = x.slice(0, -3);
    console.log("Data --> ",x);
    this.peso.emit(x);
    this.closeModal();
  }

}
