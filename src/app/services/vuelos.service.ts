import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Vuelo } from '../models/Vuelo';

@Injectable({
  providedIn: 'root'
})
export class VuelosService {

  constructor(private http: HttpClient) { }

  create(vuelo: Vuelo) {
    let data = {
      idVuelo: 0,
      idDestino: vuelo.idDestino,
      noViajeros: vuelo.noViajeros,
      tarifa: vuelo.tarifa,
      comision: vuelo.comision,
      comisionAgente: vuelo.comisionAgente,
      clase: vuelo.clase,
      fecha: vuelo.fecha,
      origen: vuelo.origen,
      destino: vuelo.destino,
      horaSalida: vuelo.horaSalida,
      horaLlegada: vuelo.horaLlegada,
      maletaPeso: vuelo.maletaPeso,
      descripcion: vuelo.descripcion,
      notas: vuelo.notas,
      opcional : vuelo.opcional
    }
    return this.http.post(`${environment.API_URI}/vuelos/create`, data);
  }
  agregarEmpresa(dato)
  {
    return this.http.post(`${environment.API_URI}/vuelos/agregarEmpresa`, dato);
  }

  upgrade(vuelo: any){
    return this.http.post(`${environment.API_URI}/vuelos/upgrade`, vuelo);
  }



  getVuelosUpgrade(idVuelo: number){
    return this.http.get(`${environment.API_URI}/vuelos/getVuelosUpgrade/${idVuelo}`);
  }

  update(vuelo: any, upgrades: any) {
    let data = {
      idVuelo: vuelo.idVuelo,
      idDestino: vuelo.idDestino,
      noViajeros: vuelo.noViajeros,
      tarifa: vuelo.tarifa,
      comision: vuelo.comision,
      comisionAgente: vuelo.comisionAgente,
      clase: vuelo.clase,
      fecha: vuelo.fecha,
      origen: vuelo.origen,
      destino: vuelo.destino,
      horaSalida: vuelo.horaSalida,
      horaLlegada: vuelo.horaLlegada,
      maletaPeso: vuelo.maletaPeso,
      descripcion: vuelo.descripcion,
      notas: vuelo.notas,
      opcional: vuelo.opcional,
      idCotizacion: vuelo.idCotizacion,
      total: vuelo.total,
      precioPorPersona: vuelo.precioPorPersona
    }

    return this.http.put(`${environment.API_URI}/vuelos/update/${data.idVuelo}`,[data,upgrades]);
  }


  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/vuelos/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/vuelos/updateInfoExtra/${info.idVueloInfo}`, info);
  } 



}
