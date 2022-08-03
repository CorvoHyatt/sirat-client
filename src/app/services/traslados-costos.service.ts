import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Traslado_costo } from './../models/Traslado_costo';

@Injectable({
  providedIn: 'root'
})
export class TrasladosCostosService {

  constructor(private http: HttpClient) {}

  create(trasladoCosto: Traslado_costo) {
    return this.http.post(`${environment.API_URI}/trasladosCostos/create`, trasladoCosto);
  }

  listByTrasladoVehiculo(idTraslado:number, idVehiculo: number) {
    return this.http.get(`${environment.API_URI}/trasladosCostos/listByIdTrasladoIdVehiculo/${idTraslado}/${idVehiculo}`);
  }

  listByIdCiudadMuelle(idCiudad:number) {
    return this.http.get(`${environment.API_URI}/trasladosCostos/listByIdCiudadMuelle/${idCiudad}`);
  }

  listCostsByTransfer(id: number){
    return this.http.get(`${environment.API_URI}/traslados/listCostsByTransfer/${id}`);
  }

  listOne(idTrasladoCosto: number) {
    return this.http.get(`${environment.API_URI}/trasladosCostos/listOne/${idTrasladoCosto}`);
  }

  listByIdTraslado(idTraslado: number) {
    return this.http.get(`${environment.API_URI}/trasladosCostos/listByIdTraslado/${idTraslado}`);
  }

  updateDivisa(divisa){
    return this.http.put(`${environment.API_URI}/trasladosCostos/updateDivisa/${divisa.idTraslado}`, divisa);
  }

  update(tarifa){
    return this.http.put(`${environment.API_URI}/trasladosCostos/update/${tarifa.idTrasladoCosto}`, tarifa);
  }

  delete(idTrasladoCosto){
    return this.http.delete(`${environment.API_URI}/trasladosCostos/delete/${idTrasladoCosto}`);
  }


}
