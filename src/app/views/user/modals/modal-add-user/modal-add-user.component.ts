import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Apollo, gql, QueryRef } from 'apollo-angular';




@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {

  constructor(private userService: UserService, private apollo: Apollo) { }

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
    id_tipo_usuario: new FormControl('1', [Validators.required]),

  });



  ngOnInit(): void {
    //if(this.editUser){
      this.initForm();
    //}
  }


  @Input()
  public displayStyle: string = '';

  @Input()
  public dataUser!:any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {

    if(!this.dataUser.id){
      const POST_USUARIOS = gql`
      mutation InsertarUsuario($object: usuarios_insert_input!) {
        insert_usuarios_one(object: $object) {
          id
        }
      }
      `;

      console.log("Formulario INSERT: ", this.form.value);
      this.apollo.mutate({
        mutation: POST_USUARIOS,
        variables: {
          object: this.form.value
        }
      }).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
      console.log("Formulario UPDATE: ", this.form.value);
      console.log("Formulario UPDATE: ", this.dataUser.id);

      const POST_USUARIOS = gql`
      mutation ActualizarUsuario($object: usuarios_set_input!, $id: Int) {
        update_usuarios(where: {id: {_eq: $id}}, _set: $object) {
          returning {
            id
          }
        }
      }
      
      `;

      this.apollo.mutate({
        mutation: POST_USUARIOS,
        variables: {
          object: this.form.value,
          id : this.dataUser.id
        }
      }).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      });
  
    }

    
    
  }

  initForm() {
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
