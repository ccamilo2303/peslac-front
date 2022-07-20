import { Injectable } from '@angular/core';
import { isNonNullChain } from 'typescript/lib/tsserverlibrary';

export interface Usuario{
    idUsuario:any,
    nombres:string,
    apellidos:string,
    nit:string,
    estacion:string,
    idTipoUsuario:any,
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    usuario: Usuario = {
        idUsuario : null,
        nombres : "",
        apellidos : "",
        nit : "",
        estacion : "",
        idTipoUsuario : null
    };
    
    getInfoUsuario():Usuario{
        return this.usuario;
    }

    getNombre(){
        return this.usuario.nombres.concat(" ", this.usuario.apellidos);
    }

    getTipoUsuario(){
        return this.usuario.idTipoUsuario;
    }

    getIdUsuario(){
        return this.usuario.idUsuario;
    }

    setUsuario(usuario:any){
        this.usuario = usuario;
    }

}