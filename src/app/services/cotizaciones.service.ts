import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { environment } from '../../environments/environment';

import { Cotizacion } from '../models/Cotizacion';
import { Timeline } from '../models/Timeline';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  constructor(private http: HttpClient) { }

  dameAsesor(idUsuario: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/dameAsesor/${idUsuario}`);
  }
  updateEstadoAEnviado(idCotizacion: number,estado:number) 
  {
    // console.log("updateEstadoAEnviado");
      return this.http.put(`${environment.API_URI}/cotizaciones/updateEstadoAEnviado/${idCotizacion}/${estado}`,null);
  }
  actualizar(datos): Observable<any> 
  {  
    // console.log("actualizar cotizaciones.service");
      return this.http.put(`${environment.API_URI}/cotizaciones/updateAuxiliar/${datos.idCotizacion}`,datos);
  }
  deleteItinerarioAuxiliar(idCotizacion: number) {
    return this.http.delete(`${environment.API_URI}/cotizaciones/delete/${idCotizacion}`);
  }

  guardarItinerarioAuxiliar(datos): Observable<any> 
  {  
    // console.log("guardar itinerario cotizaciones.service");
      return this.http.post(`${environment.API_URI}/cotizaciones/itinerario/create`,datos);
  }
  guardar(datos): Observable<any> 
  {  
    // console.log("guardar cotizaciones.service");
      return this.http.post(`${environment.API_URI}/cotizaciones/createAuxiliar`,datos);
  }
  existeItinerarioAuxiliar(idCotizacion: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/existeItinerarioAuxiliar/${idCotizacion}`);
  }
  existeAuxiliar(idCotizacion: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/existeAuxiliar/${idCotizacion}`);
  }
  list_oneResumen(idCotizacion: number) 
  {
    // console.log("list_oneResumen");
    return this.http.get(`${environment.API_URI}/cotizaciones/list_oneResumen/${idCotizacion}`);
  }
  list_oneCompleta(idCotizacion: number) 
  {
    // console.log("list_oneResumen");
    return this.http.get(`${environment.API_URI}/cotizaciones/list_oneCompleta/${idCotizacion}`);
  }
  list_paises(idCotizacion: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/list_paises/${idCotizacion}`);
  }
  listImagenesCiudadesPortada(idCotizacion) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/listImagenesCiudadesPortada/${idCotizacion}`);
  }
  listImagenesCiudadesEvento(idCotizacion) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/listImagenesCiudadesEvento/${idCotizacion}`);
  }
  listImagenesCiudadesDaybyday(idCotizacion) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/listImagenesCiudadesDaybyday/${idCotizacion}`);
  }
  list_ciudades(idCotizacion: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/list_ciudades/${idCotizacion}`);
  }
  list_continentes(idCotizacion: number) 
  {
    return this.http.get(`${environment.API_URI}/cotizaciones/list_continentes/${idCotizacion}`);
  }



  
  create(cotizacion: any) {
    delete cotizacion.personas;
    return this.http.post(`${environment.API_URI}/cotizaciones/create`, cotizacion);
  }

  createNewVersionCotizacion(cotizacion: any) {
    delete cotizacion.personas;
    return this.http.post(`${environment.API_URI}/cotizaciones/createNewVersionCotizacion`, cotizacion);
  }

  createNota(nota: any) {
    return this.http.post(`${environment.API_URI}/cotizaciones/createNota`, nota);
  }

  createVersion(version: any) {
    return this.http.post(`${environment.API_URI}/cotizaciones/createVersion`, version);
  }

  getNotasByCotizacion(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones/getNotasByCotizacion/${idCotizacion}`);
  }

  update(cotizacion: Cotizacion) {
    return this.http.put(`${environment.API_URI}/cotizaciones/update/${cotizacion.idCotizacion}`, cotizacion);
  }

  updateCreatedAt(idCotizacion: number) {
    return this.http.put(`${environment.API_URI}/cotizaciones/updateCreatedAt/${idCotizacion}`, '');
  }

  list_one(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones/list_one/${idCotizacion}`);
  }

  listOneOC(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones/listOneOC/${idCotizacion}`);
  }

  listByUserWithFilter(id: number, filter: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones/listByUserWithFilter/${id}/${filter}`);
  }

  listByFilter(filter: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones/listByFilter/${filter}`);
  }

  getComisionAgenteByCotizacion(idCotizacion: number, type: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/getComisionAgenteByCotizacion/${idCotizacion}/${type}`);
  }

  search(search: string){
    return this.http.get(`${environment.API_URI}/cotizaciones/search/${search}`);
  }

  insertVersion(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/getVersionesByCotizacion/${idCotizacion}`);
  }

  getVersionesByCotizacion(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/getVersionesByCotizacion/${idCotizacion}`);
  }

  getNotificationsByUser(idUsuario: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/getNotificationsByUser/${idUsuario}`);
  }

  changeOwner(idUsuario: number, idCotizacion: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/changeOwner/${idUsuario}/${idCotizacion}`);
  }

  getArchivosCotizacion(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/cotizaciones/getArchivosCotizacion/${idCotizacion}`);
  }

  addTimeline(timeline: Timeline){
    return this.http.post(`${environment.API_URI}/cotizaciones/addTimeline`, timeline);
  }
}
