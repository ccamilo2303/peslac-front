import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_PACKAGES_VALIDACION = gql`
query ConsultarPaquete {
  paquetes(order_by: {id: asc}) {
    producto {
      nombre
      codigo_barras
    }
  }
}
`;

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
mutation InsertarConfiguracionPaquete($object: [configuracion_paquetes_insert_input!]!) {
  insert_configuracion_paquetes(objects: $object) {
    returning {
      id
    }
  }
}
`;

const DELETE_PACKAGES = gql`
mutation EliminarConfiguracionPaquete( $id: Int) {
  delete_configuracion_paquetes(where: {id_paquete: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }

  getPackages(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PACKAGES
    });

    return this.postsQuery.valueChanges;
  }

  getPackagesValidation(): Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_PACKAGES_VALIDACION
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

 

  deletePackageConfiguration(id: any) {
    return this.apollo.mutate({
      mutation: DELETE_PACKAGES,
      variables: {
        id: id
      }
    });
  }

  delete(data: any) {

  }

}
