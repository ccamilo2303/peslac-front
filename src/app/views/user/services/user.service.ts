import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../response-types/user';

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
  }
  tipos_usuarios(order_by: {id: asc}) {
    id
    nombre
  }
}
`;



@Injectable({
  providedIn: 'root'
})
export class UserService {

  postsQuery!: QueryRef<any>;


  constructor(private http: HttpClient, private apollo: Apollo) {}

  getUsers(): Observable<any>{

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_USUARIOS
    });

    return this.postsQuery.valueChanges;
  }

  refreshUsers(){
    this.postsQuery.refetch();
  }


  getUser(idUser:number){
    return this.http.get(environment.baseUrl+"user/"+idUser);
  }

  createUser(data:User){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl+"user", data, { headers });
  }

  editUser(data:User){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.put(environment.baseUrl+"user", data, { headers });
  }

  delete(idUser:number){
    return this.http.delete(environment.baseUrl+"user/"+idUser);
  }

}
