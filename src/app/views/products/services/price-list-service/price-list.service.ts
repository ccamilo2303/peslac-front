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

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  postsQuery!: QueryRef<any>;


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

}
