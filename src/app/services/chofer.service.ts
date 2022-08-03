import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChoferService 
{

  constructor(private http: HttpClient) { }
  listTrasladosChofer15(correo) {
    return this.http
      .get(`${environment.API_URI}/choferes/listTrasladosChofer15/${correo}`);
  }
  esAceptado(idTrasladoAdquiridoInfo)
  {
    return this.http
      .get(`${environment.API_URI}/choferes/esAceptado/${idTrasladoAdquiridoInfo}`);

  }
  listTrasladosChofer15MenosAddDel(correo) {
    return this.http
      .get(`${environment.API_URI}/choferes/listTrasladosChofer15MenosAddDel/${correo}`);
  }
  listTrasladosAll15(inicio,fin) {
    return this.http
      .get(`${environment.API_URI}/choferes/listTrasladosAll15/${inicio}/${fin} `);
  }
  listTrasladosChofer15Aceptados(correo) {
    return this.http
      .get(`${environment.API_URI}/choferes/listTrasladosChofer15Aceptados/${correo}`);
  }
  listTrasladosChofer15Rechazados(correo) {
    return this.http
      .get(`${environment.API_URI}/choferes/listTrasladosChofer15Rechazados/${correo}`);
  }
  listOne(correo) {
    console.log("listOne");
    return this.http
      .get(`${environment.API_URI}/choferes/listOne/${correo}`);
  }
  addChoferTraslado(choferTraslado) 
  {
    return this.http.post(`${environment.API_URI}/choferes/addChoferTraslado`,choferTraslado);  
  }
  deleteChoferTraslado(choferTraslado) 
  {
    return this.http.post(`${environment.API_URI}/choferes/deleteChoferTraslado`,choferTraslado);  
  }
}
