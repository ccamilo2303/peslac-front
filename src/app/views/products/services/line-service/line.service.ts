import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_LINEAS = gql`
query ConsultarLineasProducto {
  lineas_producto(order_by: {id: asc}) {
    nombre
    fecha_registro
    id
  }
}
`;

const POST_LINEAS = gql`
mutation InsertarLineaProducto($object: lineas_producto_insert_input!) {
  insert_lineas_producto_one(object: $object) {    
      id
  }
}
`;

const PUT_LINEAS = gql`
mutation ActualizarLineaProducto($object: lineas_producto_set_input!, $id: Int) {
  update_lineas_producto(where: {id: {_eq: $id}}, _set: $object) {
    returning {
      id
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})

export class LineService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getLines(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_LINEAS
    });

    return this.postsQuery.valueChanges;
  }

  refreshLines() {
    this.postsQuery.refetch();
  }


  createLine(data: any) {

    return this.apollo.mutate({
      mutation: POST_LINEAS,
      variables: {
        object: data
      }
    });
  }

  editLine(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_LINEAS,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(data: any) {

  }

}
