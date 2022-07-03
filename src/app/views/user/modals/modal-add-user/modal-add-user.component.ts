import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { AppService } from '../../../../app.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit, OnDestroy  {


  @Input()
  public displayStyle: string = '';

  @Input()
  public dataUser!:any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();
  
  public tiposUsuarios!:any;
  private querySubscription!: Subscription;


  form: FormGroup = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    estacion: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
    id_tipo_usuario: new FormControl('', [Validators.required]),

  });



  constructor(private userService: UserService, private appService: AppService) { }


  ngOnInit(): void {
      this.initForm();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {

    if(!this.dataUser.id){
      this.userService.createUser(this.form.value).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
     
      this.userService.editUser(this.form.value, this.dataUser.id)
      .subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });
  
    }

    
    
  }

  initForm() {

    this.querySubscription = this.appService.getTiposUsuarios().subscribe(({ data, loading }) => {
      this.tiposUsuarios = data.tipos_usuarios;
    });

    if(this.dataUser.id != null){
      this.form.setValue({
        nombres: this.dataUser.nombres,
        apellidos: this.dataUser.apellidos,
        nit: this.dataUser.nit,
        ciudad: this.dataUser.ciudad,
        estacion: this.dataUser.estacion,
        correo: this.dataUser.correo,
        direccion: this.dataUser.direccion,
        telefono: this.dataUser.telefono,
        usuario: this.dataUser.usuario,
        clave: this.dataUser.clave,
        id_tipo_usuario: this.dataUser.id_tipo_usuario,
      });
    }
      
  
    
  }

}
