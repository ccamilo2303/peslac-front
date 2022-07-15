import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_PRODUCTOS = gql`
query ConsultaProductos {
  productos(order_by: {id: asc}) {
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
    imagen
    habilitado
    inventario_min
    id
    codigo_barras
    lineas_producto {
      nombre
    }
  }
}
`;


const GET_PRODUCTOS_VENTA = gql`
query ConsultaProductos {
  productos(order_by: {id: asc}) {
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
    imagen
    habilitado
    inventario_min
    id
    codigo_barras
    tipos_impuesto {
      id
      nombre
      cobra_iva
    }
    tipos_cantidad {
      id
      nombre
    }
    descuentos {
      id
      cantidad_max
      cantidad_min
      descuento
    }
    lineas_producto {
      nombre
    }
  }
}

`;

const POST_PRODUCTOS = gql`
mutation InsertarProducto($object: productos_insert_input!) {
  insert_productos_one(object: $object) {
    id
  }
}
`;

const PUT_PRODUCTOS = gql`
mutation ActualizarProducto($object: productos_set_input!, $id: Int) {
  update_productos(where: {id: {_eq: $id}}, _set: $object) {
    returning {
      id
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getProducts(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PRODUCTOS
    });

    return this.postsQuery.valueChanges;
  }

  getProductsVenta(){
    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PRODUCTOS_VENTA
    });

    return this.postsQuery.valueChanges;
  }


  refreshProducts() {
    this.postsQuery.refetch();
  }


  createProduct(data: any) {

    return this.apollo.mutate({
      mutation: POST_PRODUCTOS,
      variables: {
        object: data
      }
    });
  }

  editProduct(data: any, id: any) {
    return this.apollo.mutate({
      mutation: PUT_PRODUCTOS,
      variables: {
        object: data,
        id: id
      }
    });
  }

  delete(data: any) {

  }

}
