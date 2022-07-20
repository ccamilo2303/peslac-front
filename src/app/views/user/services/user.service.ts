import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_USUARIOS = gql`
query ConsultarUsarios {
  usuarios(order_by: {id: asc}) {
    id
    nombres
    apellidos
    nit
    ciudad
    estacion
    correo
    direccion
    telefono
    usuario
    clave
    id_tipo_usuario
    tipos_usuario {
      nombre
    }
  }
}
`;

const GET_USUARIO = gql`
query ConsultarUsarios($id: Int = 0) {
  usuarios(where: {id: {_eq: $id}}) {
    id
    nombres
    apellidos
    nit
    ciudad
    estacion
    correo
    direccion
    telefono
    usuario
    clave
    id_tipo_usuario
    tipos_usuario {
      nombre
    }
  }
}
`;

const POST_USUARIOS = gql`
mutation InsertarUsuario($object: usuarios_insert_input!) {
  insert_usuarios_one(object: $object) {
    id
  }
}
`;

const PUT_USUARIOS = gql`
mutation ActualizarUsuario($object: usuarios_set_input!, $id: Int) {
  update_usuarios(where: {id: {_eq: $id}}, _set: $object) {
    returning {
      id
    }
  }
}

`;


@Injectable({
  providedIn: 'root'
})
export class UserService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getUsers(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_USUARIOS
    });

    return this.postsQuery.valueChanges;
  }

  getUser(id:any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_USUARIO,
      variables: {
        id: id
      }
    });

    return this.postsQuery.valueChanges;
  }

  refreshUsers() {
    this.postsQuery.refetch();
  }


  createUser(data: any) {

    return this.apollo.mutate({
      mutation: POST_USUARIOS,
      variables: {
        object: data
      }
    });
  }

  editUser(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_USUARIOS,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(idUser: number) {

  }

}
