import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';


import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../views/user/services/user.service';
import { Subscription } from 'rxjs';
import { AppService } from '../../../app.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  nombreUsuario: String = "";
  loading: boolean = false;
  listado: any = [];

  modalAgregarUsuario: boolean = false;
  modal: string = '';

  private querySubscription!: Subscription;

  constructor(private classToggler: ClassToggleService, private route: Router, private authService: AuthService, private userService: UserService, private appService: AppService) {
    super();
  }

  ngOnInit(): void {

    this.nombreUsuario = this.authService.getNombre();

    this.querySubscription = this.userService.getUser(this.authService.getIdUsuario())
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.listado = data.usuarios[0];
      });
      
  }

  refresh() {
    this.userService.refreshUsers();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  cerrarSesion() {
    let usuario: any = {
      idUsuario: null,
      nombres: "",
      apellidos: "",
      nit: "",
      estacion: "",
      idTipoUsuario: null
    };

    this.authService.setUsuario(usuario);
  }

  openModal(data?: any) {
    switch (this.modal) {
      case 'modalAgregarUsuario':
        console.log("LLEGO");
        this.modalAgregarUsuario = true;
        this.initForm();
        break;
    }
    
  }

  closeEventModal() {
    switch (this.modal) {
      case 'modalAgregarUsuario':
        this.modalAgregarUsuario = false;
        break;
    }
    this.refresh();
    this.form.reset();
  }




  tiposUsuarios!: any;

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
    id_tipo_usuario: new FormControl({ value: '', disabled: true }, [Validators.required]),

  });

  submit() {

    this.form.controls["telefono"].setValue(this.form.controls["telefono"].value.toString())
    this.userService.editUser(this.form.value, this.listado.id)
      .subscribe(({ data }) => {

        let usuario: any = {
          idUsuario: this.listado.id,
          nombres: this.form.get("nombres")?.value,
          apellidos: this.form.get("apellidos")?.value,
          nit: this.form.get("nit")?.value,
          estacion: this.form.get("estacion")?.value,
          idTipoUsuario: this.listado.id_tipo_usuario
        };
    
        this.authService.setUsuario(usuario);
        this.nombreUsuario = this.authService.getNombre();
        console.log(this.route.url);
        if(this.route.url == '/home/ventas'){
          
          this.route.navigate(['/', 'home']).then(x => {
            console.log("cambiar ruta");  
            this.route.navigate(['/home', 'ventas']);
          });
        }
        this.mensajeOk();
      }, (error) => {
        this.mensajeError();
      });

  }

  initForm() {
    console.log("Data --> ", this.listado);
    this.querySubscription = this.appService.getTiposUsuarios().subscribe(({ data, loading }) => {
      this.tiposUsuarios = data.tipos_usuarios;
    });

    if (this.listado && this.listado.id != null) {
      this.form.setValue({
        nombres: this.listado.nombres,
        apellidos: this.listado.apellidos,
        nit: this.listado.nit,
        ciudad: this.listado.ciudad,
        estacion: this.listado.estacion,
        correo: this.listado.correo,
        direccion: this.listado.direccion,
        telefono: this.listado.telefono,
        usuario: this.listado.usuario,
        clave: this.listado.clave,
        id_tipo_usuario: this.listado.id_tipo_usuario,
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
        this.closeEventModal();
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
