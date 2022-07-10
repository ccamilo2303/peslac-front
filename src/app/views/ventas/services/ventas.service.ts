import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const PUT_ORDEN = gql`
mutation InsertarOrden($object: ordenes_insert_input!) {
  insert_ordenes_one(object: $object) {
      id
  }
}
`;

const PUT_DETALLE_ORDEN = gql`
mutation InsertarDetalleOrden($object: [detalle_ordenes_insert_input!]!) {
  insert_detalle_ordenes(objects: $object) {
    returning{
     id 
    }
  }
}
`;


const PUT_VENTA = gql`
mutation InsertarVenta($id_orden: Int) {
  insert_ventas_one(object: {id_orden: $id_orden}) {
    id
  }
}
`;

const PUT_INVENTARIO = gql`
mutation ActualizarProductoInsertaHistorial($id_producto: Int, $cantidad: Int) {
  update_productos(where: {id: {_eq: $id_producto}}, _inc: {cantidad: $cantidad}) {
    returning {
      id
    }
  }
  insert_historial_devoluciones_salidas_productos_one(object: {id_producto: $id_producto, id_tipo_operacion: 1, comentario: "Salida de producto por venta", cantidad: $cantidad}) {
    id
  }
}

`;

@Injectable({
  providedIn: 'root'
})

export class VentasService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

 

  crearOrden(data: any) {
    return this.apollo.mutate({
      mutation: PUT_ORDEN,
      variables: {
        object: data
      }
    });
  }

  crearDetalleOrden(data: any) {
    return this.apollo.mutate({
      mutation: PUT_DETALLE_ORDEN,
      variables: {
        object: data
      }
    });
  }

  crearVenta(data: any) {
    return this.apollo.mutate({
      mutation: PUT_VENTA,
      variables: {
        object: data
      }
    });
  }

  
  crearInventario(data: any) {
    return this.apollo.mutate({
      mutation: PUT_INVENTARIO,
      variables: {
        object: data
      }
    });
  }


}
