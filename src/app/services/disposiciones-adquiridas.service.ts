import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DisposicionAdquirida } from '../models/DisposicionAdquirida';
import { DisposicionAdquiridaUpgrade } from '../models/DisposicionAdquiridaUpgrade';

@Injectable({
  providedIn: 'root'
})
export class DisposicionesAdquiridasService {

 
  constructor(private http: HttpClient) { }

  create(disposicionAdquirida: DisposicionAdquirida, mejoras?: DisposicionAdquiridaUpgrade[]) {
    let data = {
      idDisposicionAdquirida: 0,
      idDisposicion: disposicionAdquirida.idDisposicion,
      idDisposicionCosto: disposicionAdquirida.idDisposicionCosto,
      pasajeros: disposicionAdquirida.pasajeros,
      equipaje: disposicionAdquirida.equipaje,
      fecha: disposicionAdquirida.fecha,
      hora: disposicionAdquirida.hora,
      descripcion: disposicionAdquirida.descripcion,
      notas: disposicionAdquirida.notas,
      pisckUp: disposicionAdquirida.pisckUp,
      horasExtras: disposicionAdquirida.horasExtras,
      tarifa: disposicionAdquirida.tarifa,
      comision: disposicionAdquirida.comision,
      comisionAgente: disposicionAdquirida.comisionAgente,
      opcional: disposicionAdquirida.opcional
    }
    return this.http.post(`${environment.API_URI}/disposicionesAdquiridas/create`, [data, mejoras]);
  }


  listOne(idDisposicionAdquirida: number) {
    console.log(idDisposicionAdquirida);
    return this.http.get(`${environment.API_URI}/disposicionesAdquiridas/listOne/${idDisposicionAdquirida}`);
  }


  getMejoras(idDisposicionAdquirida: number) {
    return this.http
      .get(`${environment.API_URI}/disposicionesAdquiridas/getMejoras/${idDisposicionAdquirida}`);
  }

  update(disposicionAdquirida, mejoras: DisposicionAdquiridaUpgrade[]) {
    let dAdquirida: any = {};
    dAdquirida.idDisposicionAdquirida = disposicionAdquirida.idDisposicionAdquirida;
    dAdquirida.idDisposicion = disposicionAdquirida.idDisposicion;
    dAdquirida.idDisposicionCosto = disposicionAdquirida.idDisposicionCosto;
    dAdquirida.pasajeros = disposicionAdquirida.pasajeros;
    dAdquirida.equipaje = disposicionAdquirida.equipaje;
    dAdquirida.fecha = disposicionAdquirida.fecha;
    dAdquirida.hora = disposicionAdquirida.hora;
    dAdquirida.descripcion = disposicionAdquirida.descripcion;
    dAdquirida.notas = disposicionAdquirida.notas;
    dAdquirida.pisckUp = disposicionAdquirida.pisckUp;
    dAdquirida.horasExtras = disposicionAdquirida.horasExtras;
    dAdquirida.tarifa = disposicionAdquirida.tarifa;
    dAdquirida.comision = disposicionAdquirida.comision;
    dAdquirida.comisionAgente = disposicionAdquirida.comisionAgente;
    dAdquirida.opcional = disposicionAdquirida.opcional;

    dAdquirida.total = disposicionAdquirida.total;
    dAdquirida.idCotizacion = disposicionAdquirida.idCotizacion;

    return this.http.put(`${environment.API_URI}/disposicionesAdquiridas/update/${dAdquirida.idDisposicionAdquirida}`, [dAdquirida, mejoras]);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/disposicionesAdquiridas/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/disposicionesAdquiridas/updateInfoExtra/${info.idDispAdqInfo}`, info);
  } 
}
