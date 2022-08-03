import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrasladoAdquirido } from '../models/TrasladoAdquirido';
import { TrasladoAdquiridoUpgrade } from '../models/TrasladoAdquiridoUpgrade';

@Injectable({
  providedIn: 'root'
})
export class TrasladosAdquiridosService {

  constructor(private http: HttpClient) { }

  create(trasladoAdquirido: TrasladoAdquirido, mejoras?: TrasladoAdquiridoUpgrade[]) {
    let data = {
      idTrasladoAdquirido: 0,
      idTraslado: trasladoAdquirido.idTraslado,
      idTrasladoCosto: trasladoAdquirido.idTrasladoCosto,
      pasajeros: trasladoAdquirido.pasajeros,
      equipaje: trasladoAdquirido.equipaje,
      fecha: trasladoAdquirido.fecha,
      hora: trasladoAdquirido.hora,
      descripcion: trasladoAdquirido.descripcion,
      notas: trasladoAdquirido.notas,
      tarifa: trasladoAdquirido.tarifa,
      comision: trasladoAdquirido.comision,
      comisionAgente: trasladoAdquirido.comisionAgente,
      opcional: trasladoAdquirido.opcional
    } 
    return this.http
      .post(`${environment.API_URI}/trasladosAdquiridos/create`, [data, mejoras]);
  }

  listOne(idTrasladoAdquirido: number) {
    console.log(idTrasladoAdquirido);
    return this.http
      .get(`${environment.API_URI}/trasladosAdquiridos/listOne/${idTrasladoAdquirido}`);
  }

  getMejoras(idTrasladoAdquirido: number) {
    return this.http
      .get(`${environment.API_URI}/trasladosAdquiridos/getMejoras/${idTrasladoAdquirido}`);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/trasladosAdquiridos/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/trasladosAdquiridos/updateInfoExtra/${info.idTrasladoAdquiridoInfo}`, info);
  } 

  update(trasladoAdquirido, mejoras: TrasladoAdquiridoUpgrade[]) {
    let tAdquirido: any = {};
    tAdquirido.idTrasladoAdquirido = trasladoAdquirido.idTrasladoAdquirido;
   tAdquirido.idTraslado= trasladoAdquirido.idTraslado;
   tAdquirido.idTrasladoCosto= trasladoAdquirido.idTrasladoCosto;
   tAdquirido.pasajeros= trasladoAdquirido.pasajeros;
   tAdquirido.equipaje= trasladoAdquirido.equipaje;
   tAdquirido.fecha= trasladoAdquirido.fecha;
   tAdquirido.hora= trasladoAdquirido.hora;
   tAdquirido.descripcion= trasladoAdquirido.descripcion;
   tAdquirido.notas= trasladoAdquirido.notas;
   tAdquirido.tarifa= trasladoAdquirido.tarifa;
   tAdquirido.comision= trasladoAdquirido.comision;
   tAdquirido.comisionAgente= trasladoAdquirido.comisionAgente;
   tAdquirido.opcional= trasladoAdquirido.opcional;
    tAdquirido.total = trasladoAdquirido.total;
    tAdquirido.idCotizacion = trasladoAdquirido.idCotizacion;

    return this.http.put(`${environment.API_URI}/trasladosAdquiridos/update/${trasladoAdquirido.idTrasladoAdquirido}`, [tAdquirido, mejoras]);
  }

  
}
 