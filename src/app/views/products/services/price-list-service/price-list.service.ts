import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_PACKAGES = gql`
query ConsultarPaquete {
  paquetes(order_by: {id: asc}) {
    id
    fecha_registro
    producto {
      id
      nombre
      cantidad
      id_tipo_cantidad
      precio_costo
      id_tipo_impuesto
      valor_impuesto
      precio_venta
      id_proveedor
      descripcion
      id_linea
      habilitado
      inventario_min
      codigo_barras
      imagen
    }
    configuracion_paquetes {
      producto {
        id
        nombre
        codigo_barras
      }
      cantidad
    }
  }
}
`;

const POST_PACKAGES = gql`
mutation InsertarPaquete($object: paquetes_insert_input!) {
  insert_paquetes_one(object: $object) {
      id
  }
}
`;

const POST_PACKAGES_CONFIGURATION = gql`
mutation InsertarConfiguracionPaquete($object: configuracion_paquetes_insert_input!) {
  insert_configuracion_paquetes_one(object: $object) {
      id
  }
}
`;

const PUT_PACKAGES = gql`
mutation ActualizarProducto($object: productos_set_input!, $id: Int) {
  update_productos(where: {id: {_eq: $id}}, _set: $object) {
    returning {
      id
    }
  }
}
`;

const GET_PRODUCT_LIST = gql`
query ConsultaProductos {
  lista_precios(order_by: {id: asc}) {
    id
    nombre
    fecha_registro
  }
}`;

const GET_DETAIL_PRODUCT_LIST = gql`
query ConsultarDetalleListaProductos($id_lista_precio: Int) {
  productos(order_by: {id: asc}) {
    id
    nombre
    proveedor {
      nombre
    }
    detalle_lista_precios(where: {id_lista_precio: {_eq: $id_lista_precio}}) {
      precio_lista
      id_lista_precio
    }
    lineas_producto {
      nombre
    }
    codigo_barras
    precio_venta
  }
}
`;

const DELETE_DETAIL_PRODUCT_LIST = gql`
mutation EliminarDetalleListaProductos($id_lista_precio: Int = 10) {
  delete_detalle_lista_precios(where: {id_lista_precio: {_eq: $id_lista_precio}}) {
    affected_rows
  }
}
`;

const POST_DETAIL_PRODUCT_LIST = gql`
mutation InsertarDetalleProducto($objects: [detalle_lista_precios_insert_input!]!) {
  insert_detalle_lista_precios(objects: $objects) {
    affected_rows
  }
}
`;

const PUT_PRODUCT_LIST = gql`
mutation ActualizarListaPrecios($id: Int = 10, $nombre: String = "") {
  update_lista_precios(where: {id: {_eq: $id}}, _set: {nombre: $nombre}) {
    affected_rows
  }
}`;


const POST_PRODUCT_LIST = gql`
mutation InsertarListaPrecios($nombre: String = "") {
  insert_lista_precios(objects: {nombre: $nombre}) {
    returning {
      id
    }
  }
}`;







@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  postsQuery!: QueryRef<any>;
  postsQueryProductoList!: QueryRef<any>;
  postsQueryDetailProductoList!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getPackages(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PACKAGES
    });

    return this.postsQuery.valueChanges;
  }

  refreshPackages() {
    this.postsQuery.refetch();
  }


  createPackage(data: any) {

    return this.apollo.mutate({
      mutation: POST_PACKAGES,
      variables: {
        object: data
      }
    });
  }

  createPackageConfiguration(data: any) {

    return this.apollo.mutate({
      mutation: POST_PACKAGES_CONFIGURATION,
      variables: {
        object: data
      }
    });
  }

  editPackage(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_PACKAGES,
      variables: {
        object: data,
        id: id
      }
    });
  }

  editPackageConfiguration(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_PACKAGES,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(data: any) {

  }


  getProductList(){
    
    this.postsQueryProductoList = this.apollo.watchQuery<any>({
      query: GET_PRODUCT_LIST
    });

    return this.postsQueryProductoList.valueChanges;    
  }

  postProductList(nombre:any){

    return this.apollo.mutate({
      mutation: POST_PRODUCT_LIST,
      variables: {
        nombre: nombre
      }
    });
  }


  refreshProductList(){
    this.postsQueryProductoList.refetch();
  }

  
  getDetailProductList(id_lista_precio:any){
    
    this.postsQueryDetailProductoList = this.apollo.watchQuery<any>({
      query: GET_DETAIL_PRODUCT_LIST,
      variables: {
        id_lista_precio: id_lista_precio
      }
    });

    return this.postsQueryDetailProductoList.valueChanges;    
  }


  deleteDetailProductListConfiguration(id_lista_precio: any) {

    return this.apollo.mutate({
      mutation: DELETE_DETAIL_PRODUCT_LIST,
      variables: {
        id_lista_precio: id_lista_precio
      }
    });
  }

  insertDetailProductListConfiguration(objects: any) {

    return this.apollo.mutate({
      mutation: POST_DETAIL_PRODUCT_LIST,
      variables: {
        objects: objects
      }
    });
  }


  updateProductListConfiguration(id: any, nombre:any) {

    return this.apollo.mutate({
      mutation: PUT_PRODUCT_LIST,
      variables: {
        id: id,
        nombre: nombre
      }
    });
  }


}
