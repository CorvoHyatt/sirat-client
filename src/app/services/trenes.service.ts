import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tren } from '../models/Tren';

@Injectable({
  providedIn: 'root'
})
export class TrenesService {

  constructor(private http: HttpClient) { }

  create(tren: Tren) {
    let data = {
      idTren: 0,
      idDestino: tren.idDestino,
      noViajerosMayores: tren.noViajerosMayores,
      tarifaMayores: tren.tarifaMayores,
      noViajerosMenores: tren.noViajerosMenores,
      tarifaMenores: tren.tarifaMenores,
      tarifa: tren.tarifa,
      comision: tren.comision,
      comisionAgente: tren.comisionAgente,
      clase: tren.clase,
      origen: tren.origen,
      fecha: tren.fecha,
      destino: tren.destino,
      horario: tren.horario,
      notas: tren.notas,
      descripcion: tren.descripcion,
      opcional: tren.opcional

    }
    return this.http.post(`${environment.API_URI}/trenes/create`, data);
  }
  agregarEmpresa(dato)
  {
    return this.http.post(`${environment.API_URI}/trenes/agregarEmpresa`, dato);
  }

  upgrade(tren: any){
    return this.http.post(`${environment.API_URI}/trenes/upgrade`, tren);
  }

  actualizarHorario(horario: any, id: number){
    return this.http.put(`${environment.API_URI}/trenes/actualizarHorario/${id}`, horario);
  }


  getTrenesUpgrade(idTren: number){
    return this.http.get(`${environment.API_URI}/trenes/getTrenesUpgrade/${idTren}`);
  }


  update(tren: any, upgrades: any) {
    let data = {
      idTren: tren.idTren,
      idDestino: tren.idDestino,
      noViajerosMayores: tren.noViajerosMayores,
      tarifaMayores: tren.tarifaMayores,
      noViajerosMenores: tren.noViajerosMenores,
      tarifaMenores: tren.tarifaMenores,
      tarifa: tren.tarifa,
      comision: tren.comision,
      comisionAgente: tren.comisionAgente,
      clase: tren.clase,
      origen: tren.origen,
      fecha: tren.fecha,
      destino: tren.destino,
      horario: tren.horario,
      notas: tren.notas,
      descripcion: tren.descripcion,
      opcional: tren.opcional,
      idCotizacion: tren.idCotizacion,
      total: tren.total,
      precioPorPersona: tren.precioPorPersona
    }

    return this.http.put(`${environment.API_URI}/trenes/update/${data.idTren}`,[data,upgrades]);
  }


  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/trenes/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/trenes/updateInfoExtra/${info.idTrenInfo}`, info);
  } 

} 