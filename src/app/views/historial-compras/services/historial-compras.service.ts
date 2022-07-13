import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_HISTORIAL_COMPRAS_GENERAL = gql`
query ConsultarHistoricoComprasGeneral {
  compras(order_by: {id: asc}) {
    id
    fecha_registro
    proveedore {
      nombre
    }
    ordene {
      usuario {
        nombres
        apellidos
      }
      detalle_ordenes {
        total
      }
    }
  }
}
`;

const GET_HISTORIAL_COMPRAS_DETALLADO = gql`
query ConsultarHistoricoComprasDetallado {
  vis_detalle_compras {
    id_venta
    producto
    cantidad
    precio_venta
    linea_producto
    proveedor
    total
  }
}
`;

const GET_DETALLE_COMPRA = gql`
query ConsultarDetalleCompra($idCompra: Int = 1) {
  compras(where: {id: {_eq: $idCompra}}) {
    id
    estados_compra{
      nombre
    }
    ordene{
      
    fecha_registro
    usuario {
      estacion
      nombres
      apellidos
      nit
    }
    cliente {
      nombres
      apellidos
    }
    metodos_pago {
      nombre
    }
    consecutivo
    detalle_ordenes {
      producto {
        id
        nombre
        lineas_producto {
          nombre
        }
        precio_venta
        valor_impuesto
      }
      cantidad
      total
    }
    }
  }
}
`;


const POST_ANULAR_COMPRA = gql`
mutation AnularVenta($id_venta: Int = 10, $comentario: String = "") {
  insert_ventas_anuladas_one(object: {id_venta: $id_venta, comentario: $comentario}) {
    id
  }
  update_ventas(where: {id: {_eq: $id_venta}}, _set: {anulado: true}) {
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

export class HistorialComprasService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getHistorialComprasGeneral(fechaInicio?: any, fechaFin?: any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_COMPRAS_GENERAL,
      variables: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

    return this.postsQuery.valueChanges;
  }

  getHistorialComprasDetallado(fechaInicio?: any, fechaFin?: any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_COMPRAS_DETALLADO,
      variables: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

    return this.postsQuery.valueChanges;
  }

  getDetalleCompra(idCompra:any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_DETALLE_COMPRA,
      variables: {
        idCompra: idCompra
      }
    });

    return this.postsQuery.valueChanges;
  }

  refreshHistorial() {
    this.postsQuery.refetch();
  }


  createAnularCompra(id_venta: any, comentario: any) {
    return this.apollo.mutate({
      mutation: POST_ANULAR_COMPRA,
      variables: {
        id_venta: id_venta,
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
