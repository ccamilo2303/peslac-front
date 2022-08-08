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
        return this.getObjUsuario();
    }

    getNombre(){
        return this.getObjUsuario().nombres.concat(" ", this.usuario.apellidos);
    }

    getTipoUsuario(){
        return this.getObjUsuario().idTipoUsuario;
    }

    getIdUsuario(){
        return this.getObjUsuario().idUsuario;
    }

    setUsuario(usuario:any){
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuario = usuario;
    }

    getObjUsuario(){
        return JSON.parse(localStorage.getItem('usuario') || '');
    }
}