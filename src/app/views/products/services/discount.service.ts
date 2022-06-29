import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../response-types/product';


@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient) { }

  getDiscounts() {
    return this.http.get(environment.baseUrl + "user");
  }

  getDiscount(idDiscount: string) {
    return this.http.get(environment.baseUrl + "user/" + idDiscount);
  }

  createDiscount(data: Product) {
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl + "user", data, { headers });
  }

  editDiscount(data: Product) {
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.put(environment.baseUrl + "user", data, { headers });
  }

  delete(idDiscount: string) {
    return this.http.delete(environment.baseUrl + "user/" + idDiscount);
  }

}
