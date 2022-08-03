import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Extra } from '../models/Extra';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

   constructor(private http: HttpClient) { }

    create(extra: Extra) {
      let data = {
        comision: extra.comision,
        comisionAgente: extra.comisionAgente,
        extras: extra.extras,
        fecha: extra.fecha,
        idCiudad: extra.idCiudad,
        idDestino: extra.idDestino,
        idExtras: 0,
        notas: extra.notas,
        tarifa: extra.tarifa,
        opcional: extra.opcional
      }
      return this.http.post(`${environment.API_URI}/extras/create`, data);
   }
   agregarEmpresa(dato)
   {
     console.log(dato);
     return this.http.post(`${environment.API_URI}/extras/agregarEmpresa`, dato);
   }
   update(extra: any) {
     let data = {
       idExtras: extra.idExtras,
      comision: extra.comision,
      comisionAgente: extra.comisionAgente,
      extras: extra.extras,
      fecha: extra.fecha,
      idCiudad: extra.idCiudad,
      idDestino: extra.idDestino,
      notas: extra.notas,
      tarifa: extra.tarifa,
      opcional: extra.opcional,
      idCotizacion: extra.idCotizacion,
      total: extra.total,
      precioPorPersona: extra.precioPorPersona
    }

    return this.http.put(`${environment.API_URI}/extras/update/${data.idExtras}`,[data]);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/extras/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/extras/updateInfoExtra/${info.idExtrasInfo}`, info);
  } 


} 