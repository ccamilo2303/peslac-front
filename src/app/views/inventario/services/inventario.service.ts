import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_INVENTARIO = gql`
query ConsultarInventario {
  productos(order_by: {id: asc}) {
    id
    nombre
    id_linea
    cantidad
  }
}
`;

const POST_SALIDA_INVENTARIO = gql`
mutation InsertarSalida($cantidad: Int = 1, $id_producto: Int = 2, $id_tipo_operacion: Int = 2, $comentario: String = "") {
  insert_historial_devoluciones_salidas_productos_one(object: {id_producto: $id_producto, id_tipo_operacion: $id_tipo_operacion, cantidad: $cantidad, comentario: $comentario}) {
    id
  }
  update_productos(where: {id: {_eq: $id_producto}}, _inc: {cantidad: $cantidad}) {
    returning {
      id
    }
  }
}
`;

const POST_DEVOLUCION_INVENTARIO = gql`
mutation InsertarDevolucion($cantidad: Int = 1, $id_producto: Int = 2, $id_tipo_operacion: Int = 2, $comentario: String = "") {
  insert_historial_devoluciones_salidas_productos_one(object: {id_producto: $id_producto, id_tipo_operacion: $id_tipo_operacion, cantidad: $cantidad, comentario: $comentario}) {
    id
  }
  update_productos(where: {id: {_eq: $id_producto}}, _inc: {cantidad: $cantidad}) {
    returning {
      id
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getInventario(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_INVENTARIO
    });

    return this.postsQuery.valueChanges;
  }

  refreshClientes() {
    this.postsQuery.refetch();
  }


  createSalidaInventario(data: any) {
    return this.apollo.mutate({
      mutation: POST_SALIDA_INVENTARIO,
      variables: {
        object: data
      }
    });
  }

  createDevolucionInventario(data: any) {
    return this.apollo.mutate({
      mutation: POST_DEVOLUCION_INVENTARIO,
      variables: {
        object: data
      }
    });
  }

}
