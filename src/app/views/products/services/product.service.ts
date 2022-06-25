import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../response-types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getUsers(){
    return this.http.get(environment.baseUrl+"user");
  }

  getUser(idUser:string){
    return this.http.get(environment.baseUrl+"user/"+idUser);
  }

  createUser(data:Product){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl+"user", data, { headers });
  }

  deleteUser(idUser:string){
    return this.http.delete(environment.baseUrl+"user/"+idUser);
  }

}
