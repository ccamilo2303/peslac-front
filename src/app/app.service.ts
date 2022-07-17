import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { EventInterface } from './event.interface';

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
      cobra_iva
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

  postsQuery!: QueryRef<any>;

  public eventInterface!:EventInterface;

  constructor(private apollo: Apollo) { }
 
  getTiposUsuarios(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_USUARIOS
      });

    return this.postsQuery.valueChanges;
  }

  getTiposCantidad(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_CANTIDAD
      });
    return this.postsQuery.valueChanges;
  }

  getTiposImpuesto(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_TIPOS_IMPUESTO
      });
    return this.postsQuery.valueChanges;
  }

  getListadoProveedores(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_PROVEEDORES
      });
    return this.postsQuery.valueChanges;
  }

  getLineasProducto(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_LINEAS_PRODUCTO
      });
    return this.postsQuery.valueChanges;
  }

  getListadoProductos(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_PRODUCTOS
      });
    return this.postsQuery.valueChanges;
  }

  getListadoMetodosPago(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_METODOS_PAGO
      });
    return this.postsQuery.valueChanges;
  }

  getListadoCondicionPago(): Observable<any> {
    this.postsQuery = this.apollo
      .watchQuery<any>({
        query: GET_LIST_CONDICION_DE_PAGO
      });
    return this.postsQuery.valueChanges;
  }

  refreshAppService() {
    this.postsQuery.refetch();
  }

  ejecutarEventoBusqueda(sCode:any){
    this.eventInterface.busquedaEventBarCode(sCode);
  }


}