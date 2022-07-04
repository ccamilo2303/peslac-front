import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_PROVEEDORES = gql`
query ConsultarProveedores {
    proveedores(order_by: {id: asc}) {
      id
      razon_social
      nombre
      nit
      celular
      cuenta
      banco
      tipo_cuenta
      direccion
      correo
      telefono
    }
  }  
`;

const POST_PROVEEDORES = gql`
mutation InsertarProveedor($object: proveedores_insert_input!) {
    insert_proveedores_one(object: $object) {
      id
    }
  }  
`;

const PUT_PROVEEDORES = gql`
mutation ActualizarProveedor($object: proveedores_set_input!, $id: Int) {
    update_proveedores(where: {id: {_eq: $id}}, _set: $object) {
      returning {
        id
      }
    }
  }  
`;

@Injectable({
  providedIn: 'root'
})

export class ProveedoresService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getProveedores(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PROVEEDORES
    });

    return this.postsQuery.valueChanges;
  }

  refreshProducts() {
    this.postsQuery.refetch();
  }


  createProveedores(data: any) {
    return this.apollo.mutate({
      mutation: POST_PROVEEDORES,
      variables: {
        object: data
      }
    });
  }

  editProveedores(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_PROVEEDORES,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(data: any) {

  }

}
