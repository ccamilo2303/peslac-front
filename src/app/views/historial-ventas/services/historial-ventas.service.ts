import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_HISTORIAL_VENTAS_GENERAL = gql`
query InformeVentasGeneral($fechaInicio: date = "2022-07-02", $fechaFin: date = "2022-07-03") {
  ventas(order_by: {id: asc}, where: {ordene: {fecha_registro: {_gte: $fechaInicio, _lte: $fechaFin}}, anulado: {_eq: false}}) {
    id
    fecha_registro
    ordene {
      cliente {
        nombres
        apellidos
      }
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

const GET_HISTORIAL_VENTAS_DETALLADO = gql`
query InformeVentasDetallado($fechaInicio: date = "2022-07-02", $fechaFin: date = "2022-07-03") {
  detalle_ordenes(where: {ordene: {ventas: {fecha_registro: {_gte: $fechaInicio, _lte: $fechaFin}}}}) {
    ordene {
      id
      cliente {
        nombres
        apellidos
      }
    }
    producto {
      nombre
      precio_venta
      lineas_producto {
        nombre
      }
    }
    cantidad
    total
  }
}
`;

const GET_DETALLE_VENTA = gql`
query ConsultarDetalleVenta($idVenta: Int = 4) {
  ventas(where: {id: {_eq: $idVenta}}) {
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
        valor_inpuesto
      }
      cantidad
      total
    }
    }
  }
}
`;

const GET_HISTORIAL_VENTAS_ANULADAS = gql`
query VentasAnuladas($fechaInicio: date = "2022-07-02", $fechaFin: date = "2022-07-03") {
  ventas_anuladas(where: {fecha_registro: {_gte: $fechaInicio, _lte: $fechaFin}}) {
    venta {
      id
      fecha_registro
      ordene{
      cliente {
        nombres
        apellidos
      }
      usuario {
        nombres
        apellidos
      }
      }
    }
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

export class HistorialVentasService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getHistorialVentasGeneral(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_VENTAS_GENERAL
    });

    return this.postsQuery.valueChanges;
  }

  getHistorialVentasDetallado(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_VENTAS_DETALLADO
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
