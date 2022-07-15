import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_INVENTARIO = gql`
query ConsultarInventario {
  productos(order_by: {id: asc}) {
    id
    nombre
    cantidad
    precio_costo 
    codigo_barras
    lineas_producto {
      nombre
    }
  }
}
`;

const GET_HISTORIAL = gql`
query ConsultarHistorialInventario {
  historial_devoluciones_salidas_productos(order_by: {id: asc}) {
    id
    fecha_registro
    producto {
      nombre
    }
    cantidad
    comentario
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

  getHistorial(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL
    });

    return this.postsQuery.valueChanges;
  }

  refreshInventario() {
    this.postsQuery.refetch();
  }


  createSalidaInventario(id_producto: any, id_tipo_operacion: any, cantidad: any, comentario: any) {
    return this.apollo.mutate({
      mutation: POST_SALIDA_INVENTARIO,
      variables: {
        id_producto: id_producto,
        id_tipo_operacion: id_tipo_operacion,
        cantidad: cantidad,
        comentario: comentario
      }
    });
  }

  createDevolucionInventario(id_producto: any, id_tipo_operacion: any, cantidad: any, comentario: any) {
    return this.apollo.mutate({
      mutation: POST_DEVOLUCION_INVENTARIO,
      variables: {
        id_producto: id_producto,
        id_tipo_operacion: id_tipo_operacion,
        cantidad: cantidad,
        comentario: comentario
      }
    });
  }

}
