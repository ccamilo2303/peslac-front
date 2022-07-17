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
export class ModalAddUserComponent implements OnInit, OnDestroy {


  @Input()
  public data: any;

  @Input()
  public listadoUsuarios: any;

  @Output()
  public closeEvent = new EventEmitter<boolean>();

  public tiposUsuarios!: any;
  private querySubscription!: Subscription;


  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    apellidos: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    nit: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    ciudad: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    estacion: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
    direccion: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    telefono: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    usuario: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    clave: new FormControl('', [Validators.required, Validators.maxLength(40)]),
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

    this.form.controls["telefono"].setValue(this.form.controls["telefono"].value.toString())

    if (!this.data.id) {

      let validacionUsuario: any[] = this.listadoUsuarios.filter((usuario: any) => usuario.usuario == this.form.controls["usuario"].value);
      let validacionNit: any[] = this.listadoUsuarios.filter((usuario: any) => usuario.nit == this.form.controls["nit"].value);
      let validacionCorreo: any[] = this.listadoUsuarios.filter((usuario: any) => usuario.correo == this.form.controls["correo"].value);

      if (validacionNit.length > 0) {
        this.mensajeErrorValidacion("El NIT ingresado ya existe");
        return;
      }

      if (validacionCorreo.length > 0) {
        this.mensajeErrorValidacion("El correo ingresado ya existe");
        return;
      }

      if (validacionUsuario.length > 0) {
        this.mensajeErrorValidacion("El usuario ingresado ya existe");
        return;
      }

      this.userService.createUser(this.form.value).subscribe(({ data }) => {
        this.mensajeOk();
      }, (error) => {
        this.mensajeError();
      });

    } else {

      this.userService.editUser(this.form.value, this.data.id)
        .subscribe(({ data }) => {
          this.mensajeOk();
        }, (error) => {
          this.mensajeError();
        });

    }

  }

  initForm() {

    this.querySubscription = this.appService.getTiposUsuarios().subscribe(({ data, loading }) => {
      this.tiposUsuarios = data.tipos_usuarios;
    });
    
    if (this.data && this.data.id != null) {
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

  private mensajeErrorValidacion(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
