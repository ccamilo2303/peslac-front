import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../../response-types/product';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';


const GET_DESCUENTO = gql`
query ConsultarDescuentos($id_producto: Int ) {
  config_descuentos(where: {id_producto: {_eq: $id_producto}}) {
    cantidad_min
    cantidad_max
    descuento
  }
}`;


const POST_DESCUENTO = gql`
mutation InsertarDescuento($cantidad_min: Int , $cantidad_max: Int , $descuento: Int , $id_producto: Int ) {
  insert_config_descuentos(objects: {cantidad_min: $cantidad_min, cantidad_max: $cantidad_max, descuento: $descuento, id_producto: $id_producto}) {
    affected_rows
  }
}`;

const DELETE_DESCUENTO = gql`
mutation EliminarDescuentos($id_producto: Int) {
  delete_config_descuentos(where: {id_producto: {_eq: $id_producto}}) {
    affected_rows
  }
}`



@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  postsQuery!: QueryRef<any>;


  constructor(private apollo: Apollo) { }


  getDiscounts() : Observable<any> {

    this.postsQuery = this.apollo.watchQuery<any>({
      query: GET_DESCUENTO
    });

    return this.postsQuery.valueChanges;
  }


  createDiscount(cantidadMin: any, cantidadMax: any, descuento:any, idProducto:any) {
    return this.apollo.mutate({
      mutation: POST_DESCUENTO,
      variables: {
        cantidad_min: cantidadMin,
        cantidad_max: cantidadMax,
        descuento: descuento,
        id_producto: idProducto
      }
    });
  }

  deleteDiscount(idProducto:any){
    return this.apollo.mutate({
      mutation: DELETE_DESCUENTO,
      variables: {
        id_producto: idProducto
      }
    });
  }

}
