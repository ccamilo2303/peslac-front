import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../response-types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(){
    return this.http.get(environment.baseUrl+"user");
  }

  getUser(idUser:number){
    return this.http.get(environment.baseUrl+"user/"+idUser);
  }

  createUser(data:User){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.baseUrl+"user", data, { headers });
  }

  editUser(data:User){
    var headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.put(environment.baseUrl+"user", data, { headers });
  }

  delete(idUser:number){
    return this.http.delete(environment.baseUrl+"user/"+idUser);
  }

}
