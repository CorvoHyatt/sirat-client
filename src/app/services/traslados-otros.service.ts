import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrasladoOtro } from '../models/TrasladoOtro';
import { TrasladoOtroUpgrade } from '../models/TrasladoOtroUpgrade';

@Injectable({
  providedIn: 'root'
})
export class TrasladosOtrosService {

  constructor(private http: HttpClient) { }

  create(trasladoOtro: TrasladoOtro, mejoras?: TrasladoOtroUpgrade[]) {
    let TO = {
      idTrasladoOtro: 0,
      idCiudad: trasladoOtro.idCiudad,
      idVehiculo: trasladoOtro.idVehiculo,
      desde: trasladoOtro.desde, 
      hacia: trasladoOtro.hacia, 
      tarifa: trasladoOtro.tarifa,
      idDivisa: trasladoOtro.idDivisa,
      cancelaciones: trasladoOtro.cancelaciones, 
      comision: trasladoOtro.comision,
      comisionAgente: trasladoOtro.comisionAgente,
      notas: trasladoOtro.notas, 
      pasajeros: trasladoOtro.pasajeros,
      equipaje: trasladoOtro.equipaje,
      fecha: trasladoOtro.fecha, 
      hora: trasladoOtro.hora, 
      descripcion: trasladoOtro.descripcion, 
      opcional: trasladoOtro.opcional,
      idTraslado: trasladoOtro.idTraslado
    }
    return this.http.post(`${environment.API_URI}/trasladosOtros/create`,[TO, mejoras]);
  }


  listOne(idTrasladoOtro: number) {
    return this.http
      .get(`${environment.API_URI}/trasladosOtros/listOne/${idTrasladoOtro}`);
  }

  getMejoras(idTrasladoOtro: number) {
    return this.http
      .get(`${environment.API_URI}/trasladosOtros/getMejoras/${idTrasladoOtro}`);
  }

  
}
