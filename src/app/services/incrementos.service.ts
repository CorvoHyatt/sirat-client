import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Incremento } from '../models/incremento';

@Injectable({
  providedIn: 'root'
})
export class IncrementosService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(`${environment.API_URI}/incrementos/list`);
  }

  listFecha_ByIdActividadTipoActividad(idActividad: number, tipoActividad: number) {
    return this.http.get(`${environment.API_URI}/incrementos/listFechas_ByIdActividadTipoActividad/${idActividad}/${tipoActividad}`);
  }

  listHoras_ByIdActividadTipoActividad(idActividad: number, tipoActividad: number) {
    return this.http.get(`${environment.API_URI}/incrementos/listHoras_ByIdActividadTipoActividad/${idActividad}/${tipoActividad}`);
  }

  createIncrement(increment: Incremento) {
    return this.http.post(`${environment.API_URI}/traslados/createIncrement`, increment);
  }

  createIncrementByHour(data) {
    return this.http.post(`${environment.API_URI}/traslados/createIncrementByHour`, data);
  }

  createIncrementByDate(data) {
    return this.http.post(`${environment.API_URI}/traslados/createIncrementByDate`, data);
  }

  
  update(incremento){
    return this.http.put(`${environment.API_URI}/traslados/updateIncremento/${incremento.idIncremento}`, incremento);
  }
  
  create_list(incrementos: any, idActividad) {
    return this.http.post(`${environment.API_URI}/incrementos/create_list/${idActividad}`, incrementos);
  }


  actualizar_list(incrementos: any, idActividad: number,tipoActividad: number, tipo?: number) {
    return this.http.put(`${environment.API_URI}/incrementos/actualizar_list/${idActividad}/${tipoActividad}`, incrementos);
  }


} 