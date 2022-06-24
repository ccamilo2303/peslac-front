import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './response-types/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  displayStyle = "none";


  public listado: User[] = [
    {
      name: "Andrés Ricardo",
      last_name: "Beltrán Sarta",
      cel_phone: "3138646727",
      city: "Bogotá",
      document_number: "1234567890",
      role: "Administrador",
      id_type_user: "Administrador"
    }
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    console.log('petticion get user');
    this.initData();
    /*this.userService.getUsers().subscribe(res => {
      let results = <User[]>res;
      results.forEach(x => {
        this.listado.push(x);
      });
    }, err => {
      if (err.status == 401) {
        console.log(err);
      }
    });*/

  }

  async initData() {

    await this.userService.getUsers().subscribe(res => {
      let results = <User[]>res;
      results.forEach(x => {
        this.listado.push(x);
      });
    })

  }

  openModal(){
    this.displayStyle = "block";    
  }

  displayStyleEvent(e:string){
    this.displayStyle = e;
  }


}

