import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  cargarModelo(modelo: any, datos: any) {
    for(let key in modelo){
      if(datos.hasOwnProperty(key)){
        modelo[key] = datos[key];
      }
    }
    return modelo;
  }
  
}
