import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../response-types/product';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getGroups() {
    return this.http.get(environment.baseUrl + "user");
  }

  getGroup(idGroup: string) {
    return this.http.get(environment.baseUrl + "user/" + idGroup);
  }

  createGroup(data: Product) {
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl + "user", data, { headers });
  }

  editGroup(data: Product) {
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.put(environment.baseUrl + "user", data, { headers });
  }

  delete(idGroup: string) {
    return this.http.delete(environment.baseUrl + "user/" + idGroup);
  }

}
