import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Traslado } from './../models/Traslado';
import { Traslado_costo } from '../models/Traslado_costo';


@Injectable({
  providedIn: 'root'
})
export class TrasladosService {
  constructor(private http: HttpClient) 
  {
  }

  //Crea un traslado
  create(traslado: Traslado, costos: Traslado_costo[], idDivisa) {
    return this.http.post(`${environment.API_URI}/traslados/create`, [traslado, costos, idDivisa]);
  }

  create_fromList(traslados: any) {
    return this.http.post(`${environment.API_URI}/traslados/create_fromList`,traslados);
  }

  getTransfers(){
    return this.http.get(`${environment.API_URI}/traslados/listTransfers`);
  }

  getOne(idTraslado: number) {
    console.log(idTraslado);
    return this.http.get(`${environment.API_URI}/traslados/listOne/${idTraslado}`);
  }

  getAll(id:number) {
   // console.log("getAll");
    return this.http.get(`${environment.API_URI}/traslados/${id}`);
  }
  listVehiculosByTraslado(idTraslado:number) {
   // console.log("listVehiculosByTraslado");
    return this.http.get(`${environment.API_URI}/traslados/listbyIdVehiculos/${idTraslado}`);
  }
  listbyCiudadFullDatos(id:number) {
    //console.log("listbyCiudadFullDatos");
    return this.http.get(`${environment.API_URI}/traslados/listbyCiudadFullDatos/${id}`);
  }
  getAllbyIdTraslado(id:number) {
    //console.log("getAllbyIdTraslado");

    return this.http.get(`${environment.API_URI}/traslados/listbyIdTraslado/${id}`);
  }
  getMinByTraslado(id,personas) {
    return this.http.get(`${environment.API_URI}/traslados/minimo/${id}/${personas}`);
  }
  listTrasladoByCiudadidDesde(id)
   {
    return this.http.get(`${environment.API_URI}/traslados/listTrasladoByCiudadidDesde/${id}`);
  }
  listTrasladoByCiudadidHacia(id,desde)
   {
    return this.http.get(`${environment.API_URI}/traslados/listTrasladoByCiudadidHacia/${id}/${desde}`);
  }
  getTrasladoByDesdeHacia(idCiudad,desde,hacia)
   {
    return this.http.get(`${environment.API_URI}/traslados/getTrasladoByDesdeHacia/${idCiudad}/${desde}/${hacia}`);
  }
  listTrasladoByCiudadidDesdeCiudad(id)
   {
    //console.log("listTrasladoByCiudadidDesdeCiudad");

    return this.http.get(`${environment.API_URI}/traslados/listTrasladoByCiudadidDesdeCiudad/${id}`);
  }
  listTrasladoByCiudadidHaciaCiudad(id,desde)
   {
    //console.log("listTrasladoByCiudadidHaciaCiudad");

    return this.http.get(`${environment.API_URI}/traslados/listTrasladoByCiudadidHaciaCiudad/${id}/${desde}`);
  }

  listByPaisCiudad_vista(idPais: number, idCiudad: number) {
    return this.http
      .get(`${environment.API_URI}/traslados/listByPais_vista/${idPais}/${idCiudad}`);
  }


  incrementoByTrasladoFecha(id,fecha)
  {
    //console.log("incrementoByTrasladoFecha");

    return this.http.get(`${environment.API_URI}/traslados/incrementoByTrasladoFecha/${id}/${fecha}`);
  }
  incrementoByTrasladoFechaVariable(id,fecha)
  {
    //console.log("incrementoByTrasladoFechaVariable");

    return this.http.get(`${environment.API_URI}/traslados/incrementoByTrasladoFechaVariable/${id}/${fecha}`);
  }
  incrementoByTrasladoHora(id,hora)
  {
    //console.log("incrementoByTrasladoHora");

    return this.http.get(`${environment.API_URI}/traslados/incrementoByTrasladoHora/${id}/${hora}`);
  }

  update(traslado, costos, divisa){
    return this.http.put(`${environment.API_URI}/traslados/update/${traslado.idTraslado}`, [traslado, costos, divisa]);
  }

  delete(idTraslado: number)
  {
    return this.http.delete(`${environment.API_URI}/traslados/delete/${idTraslado}`);
  }

}
