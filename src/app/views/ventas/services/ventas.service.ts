import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_CLIENTES = gql`
query ConsultarClientes {
  clientes(order_by: {id: asc}) {
    id
    nombres
    apellidos
    cedula
    celular
    ciudad
    direccion
    id_lista_precios
  }
}
`;

const POST_CLIENTES = gql`
mutation InsertarCliente($object: clientes_insert_input!) {
  insert_clientes_one(object: $object) {
    id
  }
}  
`;

const PUT_CLIENTES = gql`
mutation ActualizarCliente($object: clientes_set_input!, $id: Int) {
  update_clientes(where: {id: {_eq: $id}}, _set: $object) {
    returning {
      id
    }
  }
} 
`;

@Injectable({
  providedIn: 'root'
})

export class VentasService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getClientes(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_CLIENTES
    });

    return this.postsQuery.valueChanges;
  }

  refreshClientes() {
    this.postsQuery.refetch();
  }


  createClientes(data: any) {
    return this.apollo.mutate({
      mutation: POST_CLIENTES,
      variables: {
        object: data
      }
    });
  }

  editClientes(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_CLIENTES,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(data: any) {

  }

}
