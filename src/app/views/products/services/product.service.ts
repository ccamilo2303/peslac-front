import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../response-types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getProducts(){
    return this.http.get(environment.baseUrl+"user");
  }

  getProduct(idProduct:string){
    return this.http.get(environment.baseUrl+"user/"+idProduct);
  }

  createProduct(data:Product){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl+"user", data, { headers });
  }

  editProduct(data:Product){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.put(environment.baseUrl+"user", data, { headers });
  }

  delete(idProduct:string){
    return this.http.delete(environment.baseUrl+"user/"+idProduct);
  }

}
