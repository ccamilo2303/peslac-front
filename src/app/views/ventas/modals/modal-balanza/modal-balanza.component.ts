import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;

var port:any;
var parser:any;
var pruebaPeso:any;

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

  public pesoCalculado:String = 'No se';

  form: FormGroup = new FormGroup({
    peso: new FormControl('Hola', [Validators.required]),
  });

  cambio: boolean = false;
  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {
    
    $("#modalBalanza").modal({ backdrop: 'static', keyboard: false, show: true });

    console.log("VA A LEER");
    port = new this.ipcService.serialPort.SerialPort({ path: 'COM4', baudRate: 9600 });
    parser = new this.ipcService.serialPort.ReadlineParser();
    port.pipe(parser);
    parser.on('data', this.calcularPeso);
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
    console.log("Destruye listener port: " , this.pesoCalculado);
    port.close( (err:any) => {
      console.log('port closed', err);
  });
  }

  closeModal() {
    this.peso.emit(1);
    this.closeEvent.emit(true);
    $("#modalBalanza").modal('hide');
  }
  
  prueba():any{
    this.pesoCalculado = pruebaPeso;
    console.log("ACTUALIZAR INPUIT --> ", this.pesoCalculado);
    console.log("Cambio --> ", this.cambio);
    return pruebaPeso;
  }

  submit() {

  }

  calcularPeso(event:any){
    console.log("Lo que llega  --> ", event);
    pruebaPeso = event;
    //console.log("Peso --> " + this.peso2);
    this.cambio = true;
  }

}
