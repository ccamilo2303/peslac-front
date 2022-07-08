import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_HISTORIAL_VENTAS_GENERAL = gql`
query InformeVentasGeneral($fechaInicio: date = "2022-01-01", $fechaFin: date = "2500-01-01") {
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
query InformeVentasDetallado($fechaInicio: date = "2022-01-01", $fechaFin: date = "2500-01-01") {
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
    id
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

const GET_HISTORIAL_VENTAS_ANULADAS = gql`
query VentasAnuladas($fechaInicio: date = "2022-01-01", $fechaFin: date = "2500-01-01") {
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
      detalle_ordenes {
        total
      }
      }
    }
  }
}
`;

const POST_ANULAR_VENTA = gql`
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

export class HistorialVentasService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getHistorialVentasGeneral(fechaInicio?: any, fechaFin?: any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_VENTAS_GENERAL,
      variables: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

    return this.postsQuery.valueChanges;
  }

  getHistorialVentasDetallado(fechaInicio?: any, fechaFin?: any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_VENTAS_DETALLADO,
      variables: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

    return this.postsQuery.valueChanges;
  }

  getHistorialVentasAnuladas(fechaInicio?: any, fechaFin?: any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_HISTORIAL_VENTAS_ANULADAS,
      variables: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });

    return this.postsQuery.valueChanges;
  }

  getDetalleVenta(idVenta:any): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_DETALLE_VENTA,
      variables: {
        idVenta: idVenta
      }
    });

    return this.postsQuery.valueChanges;
  }

  refreshInventario() {
    this.postsQuery.refetch();
  }


  createAnularVenta(id_venta: any, comentario: any) {
    return this.apollo.mutate({
      mutation: POST_ANULAR_VENTA,
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
