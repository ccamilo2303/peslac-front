import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit, OnDestroy  {


  @Input()
  public data: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();
  
  public tiposUsuarios!:any;
  private querySubscription!: Subscription;


  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    estacion: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
    id_tipo_usuario: new FormControl('', [Validators.required]),

  });

  constructor(private userService: UserService, private appService: AppService) { }

  ngOnInit(): void {
      this.initForm();
      $("#modalAgregarUsuario").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.form.reset();
    this.closeEvent.emit(true);
    $("#modalAgregarUsuario").modal('hide');
  }

  submit() {

    if(!this.data.id){
      this.userService.createUser(this.form.value).subscribe(({ data }) => {
        this.mensajeOk();
      },(error) => {
        this.mensajeError();
      });

    }else{
     
      this.userService.editUser(this.form.value, this.data.id)
      .subscribe(({ data }) => {
        this.mensajeOk();
      },(error) => {
        this.mensajeError();
      });
  
    }
  }

  initForm() {

    this.querySubscription = this.appService.getTiposUsuarios().subscribe(({ data, loading }) => {
      this.tiposUsuarios = data.tipos_usuarios;
    });

    if(this.data && this.data.id != null){
      this.form.setValue({
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        nit: this.data.nit,
        ciudad: this.data.ciudad,
        estacion: this.data.estacion,
        correo: this.data.correo,
        direccion: this.data.direccion,
        telefono: this.data.telefono,
        usuario: this.data.usuario,
        clave: this.data.clave,
        id_tipo_usuario: this.data.id_tipo_usuario,
      });
    }
      
  }

  private mensajeOk() {
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModal();
      }
    });
  }

  private mensajeError() {
    Swal.fire({
      title: 'Error guardando la información',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
