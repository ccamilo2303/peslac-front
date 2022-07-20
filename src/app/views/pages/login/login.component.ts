import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from './services/login.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  inicio: boolean = true;
  loginUser: boolean = false;
  loginSuperAdmin: boolean = false;
  superAdmin: boolean = false;

  formLogin: FormGroup = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
  });

  formSuperAdmin: FormGroup = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
    clave_confirmada: new FormControl('', [Validators.required]),
  },
    [this.MatchValidator('clave', 'clave_confirmada')]
  );

  private querySubscription!: Subscription;

  public MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  constructor(private loginService: LoginService, private route: Router, private authService: AuthService) { }

  get passwordMatchError() {
    return (
      this.formSuperAdmin.getError('mismatch') &&
      this.formSuperAdmin.get('clave_confirmada')?.touched
    );
  }

  ngOnInit(): void {
    this.querySubscription = this.loginService.getSuperAdmin()
      .subscribe(({ data, loading }) => {
        console.log("--> ", data);
        this.inicio = true;
        if (data.usuarios.length > 0) {
          this.superAdmin = true;
        }
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  init() {

    let usuario: any = this.authService.getInfoUsuario();
    if (usuario.idUsuario != null) {
      this.route.navigate(['/', 'home']);
    } else {
      this.inicio = false
      if (this.superAdmin == true) {
        this.loginUser = true
      } else {
        this.loginSuperAdmin = true
      }
    }
  }

  login() {
    console.log("LOGIN...");
    this.querySubscription = this.loginService.getUser(this.formLogin.get("usuario")?.value, this.formLogin.get("clave")?.value)
    .subscribe(({ data, loading }) => {
      console.log("--> ", data);
      if (data.usuarios.length > 0) {
        let usuario: any = {
          idUsuario: data.usuarios[0].id,
          nombres: data.usuarios[0].nombres,
          apellidos: data.usuarios[0].apellidos,
          nit: data.usuarios[0].nit,
          estacion: data.usuarios[0].estacion,
          idTipoUsuario: data.usuarios[0].id_tipo_usuario,
        };
        this.authService.setUsuario(usuario);
        if(data.usuarios[0].id_tipo_usuario == 1){
          this.route.navigate(['/home', 'ventas']);
        }else{
          this.route.navigate(['/', 'home']);
        }
      }else{
        this.mensajeErrorValidacion("El usuario o contraseña son incorrectas");
      }
    })
  }

  crearSuperAdmin() {
    let form: FormGroup = new FormGroup({
      nombres: new FormControl('Super', [Validators.required, Validators.maxLength(40)]),
      apellidos: new FormControl('Administrador', [Validators.required, Validators.maxLength(40)]),
      nit: new FormControl('', [Validators.required, Validators.maxLength(11)]),
      ciudad: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      estacion: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      direccion: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      telefono: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      usuario: new FormControl(this.formSuperAdmin.get("usuario")?.value, [Validators.required, Validators.maxLength(10)]),
      clave: new FormControl(this.formSuperAdmin.get("clave")?.value, [Validators.required, Validators.maxLength(40)]),
      id_tipo_usuario: new FormControl('3', [Validators.required]),
    });

    this.loginService.createUser(form.value).subscribe(({ data }) => {
      let x:any = data;
      this.mensajeOk(x.insert_usuarios_one.id);
    }, (error) => {
      this.mensajeError();
    });

  }

  private mensajeOk(id:any) {
    
    let usuario: any = {
      idUsuario: id,
      nombres: "",
      apellidos: "",
      nit: "",
      estacion: "",
      idTipoUsuario: 3,
    };
    this.authService.setUsuario(usuario);
    this.route.navigate(['/', 'home']);
    Swal.fire({
      title: 'Información guardada correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.closeModal();
      }
    });
  }

  private mensajeError() {
    Swal.fire({
      title: 'Error creando al Super Administrador',
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
