import { Injectable } from '@angular/core';

export interface Usuario{
    idUsuario:number,
    nombres:string,
    apellidos:string,
    nit:string,
    estacion:string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    getInfoUsuario():Usuario{
        let usuario:Usuario = {
            idUsuario : 37,
            nombres : "Cristian Camilo",
            apellidos : "Beltrán Sarta",
            nit : "1023569803",
            estacion : "Duitama"
        }

        return usuario;
    }


}