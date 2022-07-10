import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const GET_LIST_TIPOS_USUARIOS = gql`
query ConsultarTiposUsuarios {
    tipos_usuarios(order_by: {id: asc}) {
       id
       nombre
     }
   }
`;

const GET_LIST_TIPOS_CANTIDAD = gql`
query ConsultarTiposCantidad {
    tipos_cantidad(order_by: {id: asc}) {
      id
      nombre
    }
  }
`;

const GET_LIST_TIPOS_IMPUESTO = gql`
query ConsultarTiposImpuesto {
    tipos_impuesto(order_by: {id: asc}) {
      id
      nombre
    }
  }  
`;

const GET_LIST_PROVEEDORES = gql`
query ConsultarListadoProveedores {
    proveedores(order_by: {id: desc}) {
      id
      nombre
    }
  }  
`;

const GET_LIST_LINEAS_PRODUCTO = gql`
query ConsultarLineasProducto {
    lineas_producto(order_by: {id: asc}) {
      id
      nombre
      fecha_registro
    }
  }
   
`;

const GET_LIST_PRODUCTOS = gql`
query ConsultarListadoProductos {
    productos(order_by: {id: asc}) {
      id
      nombre
      codigo_barras
    }
  }
`;

const GET_LIST_METODOS_PAGO = gql`
query ConsultarMetodosDePago {
  metodos_pago(order_by: {id: asc}) {
    id
    nombre
  }
}

`;

const GET_LIST_CONDICION_DE_PAGO = gql`
query ConsultarProveedores {
  condiciones_pago(order_by: {id: asc}) {
    id
    nombre
  }
}

`;

const GET_LIST_TIPO_ORDEN = gql`
query ConsultarListadoProductos {
    productos(order_by: {id: asc}) {
      id
      nombre
      codigo_barras
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private apollo: Apollo) { }


  getTiposUsuarios() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_USUARIOS
      }).valueChanges;
  }

  getTiposCantidad() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_CANTIDAD
      }).valueChanges;
  }


  getTiposImpuesto() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_IMPUESTO
      }).valueChanges;
  }


  getListadoProveedores() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_PROVEEDORES
      }).valueChanges;
  }

  getLineasProducto() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_LINEAS_PRODUCTO
      }).valueChanges;
  }

  getListadoProductos() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_PRODUCTOS
      }).valueChanges;
  }


  getListadoMetodosPago() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_METODOS_PAGO
      }).valueChanges;
  }

  getListadoCondicionPago() {
    return this.apollo
      .watchQuery<any>({
        query: GET_LIST_CONDICION_DE_PAGO
      }).valueChanges;
  }

  


}