import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';
import { ProveedoresService } from '../../services/proveedores.service';
declare var $: any;




@Component({
  selector: 'app-modal-agregar-proveedores',
  templateUrl: './modal-agregar-proveedores.component.html',
  styleUrls: ['./modal-agregar-proveedores.component.scss']
})
export class ModalAgregarProveedoresComponent implements OnInit, OnDestroy {

  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  public tiposUsuarios!:any;
  
  


  form: FormGroup = new FormGroup({
    razon_social: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
    celular: new FormControl('', [Validators.required]),
    cuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    tipo_cuenta: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  constructor(private proveedoresService:ProveedoresService, private appService: AppService) { }

  ngOnInit(): void {

    this.initForm();

    $("#modalProveedor").modal({backdrop:'static',keyboard:false, show:true});
    

  }
  
  ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalProveedor").modal('hide');
  }


  submit() {

    if(!this.data){
      this.proveedoresService.createProveedores(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      },(error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
     
      this.proveedoresService.editProveedores(this.form.value, this.data.id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.closeModal();
      },(error) => {
        console.log('there was an error sending the query', error);
      });
  
    }
   
  }

  initForm() {


    if (this.data && this.data.id != null) {
      this.form.setValue({

        razon_social: this.data.razon_social,
        nombre: this.data.nombre,
        nit: this.data.nit,
        celular: this.data.celular,
        cuenta: this.data.cuenta,
        banco: this.data.banco,
        tipo_cuenta: this.data.tipo_cuenta,
        direccion: this.data.direccion,
        correo: this.data.correo,
        telefono: this.data.telefono,
      });
    }

  }

}

