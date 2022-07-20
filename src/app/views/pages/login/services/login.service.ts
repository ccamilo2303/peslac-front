import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_SUPER_ADMIN = gql`
query ConsultarSuperAdmin {
  usuarios(where: {id_tipo_usuario: {_eq: "3"}}, limit: 1) {
    id
  }
}
`;

const GET_USER = gql`
query ConsultarUsuario($usuario: String = "", $clave: String = "") {
  usuarios(where: {usuario: {_eq: $usuario}, clave: {_eq: $clave}}) {
    estacion
    id
    nombres
    nit
    apellidos
    id_tipo_usuario
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

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getSuperAdmin(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_SUPER_ADMIN
    });

    return this.postsQuery.valueChanges;
  }

  getUser(usuario:any, clave:any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_USER,
      variables: {
        usuario: usuario,
        clave: clave
      }
    });

    return this.postsQuery.valueChanges;
  }

  refreshLogin() {
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


}
