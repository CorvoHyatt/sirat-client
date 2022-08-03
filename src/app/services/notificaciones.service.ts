import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notificacion } from '../models/Notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) { }

  create(notificacion: Notificacion, idArea: number) {
    return this.http.post(`${environment.API_URI}/notificaciones/create/${idArea}`, notificacion);
  }

  count_sinFinalizar(idUsuario: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/count_sinFinalizar/${idUsuario}`);
  }

  count_sinFinalizarTPLPNotas(idUsuario: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/count_sinFinalizarTPLPNotas/${idUsuario}`);
  }

  list_AreasSinFinalizar(idUsuario: number, estatus: number, tipo: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/list_AreasSinFinalizar/${idUsuario}/${estatus}/${tipo}`);
  }

  listAll_ByIdUsuarioEstatusTipoArea(idUsuario: number, estatus: number, tipo: number, idArea: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/listAll_ByIdUsuarioEstatusTipoArea/${idUsuario}/${estatus}/${tipo}/${idArea}`);
  }

  listAll_ByIdAreaIdUsuario(idArea: number, idUsuario: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/listAll_ByIdAreaIdUsuario/${idArea}/${idUsuario}`);
  }

  listOne(idNotificacion: number) {
    return this.http.get(`${environment.API_URI}/notificaciones/listOne/${idNotificacion}`);
  }

  listAllFinanzas() {
    return this.http.get(`${environment.API_URI}/notificaciones/listAllFinanzas`);
  }

  update(notificacion: any){
    return this.http.put(`${environment.API_URI}/notificaciones/update/${notificacion.idNotificacion}`, notificacion);
  }

  
}
