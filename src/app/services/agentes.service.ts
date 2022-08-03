import { HttpClient } from '@angular/common/http';
import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agente } from '../models/Agente';

@Injectable({
  providedIn: 'root'
})
export class AgentesService {

  constructor(private http: HttpClient) { }

  create(agente: Agente, comsionesAgente) {
    return this.http.post(`${environment.API_URI}/agentes/create`, [agente, comsionesAgente]);
  }
  actualizarUrgente(idTrasladoAdquiridoInfo)
  {
    console.log(idTrasladoAdquiridoInfo);
    return this.http.get(`${environment.API_URI}/agentes/actualizarUrgente/${idTrasladoAdquiridoInfo}`);
  }
  actualizarFactura(facturas,idFacturaActual,extFact)
  {
    console.log(facturas,idFacturaActual,extFact);
    return this.http.post(`${environment.API_URI}/agentes/actualizarFactura/${idFacturaActual}/${extFact}`, [facturas]);
  }
  listAgentes() {
    return this.http
      .get(`${environment.API_URI}/agentes/listAgentes`);
  }
  listTimelineByCotizacion(idCotizacion: number) {
    return this.http
      .get(`${environment.API_URI}/agentes/listTimelineByCotizacion/${idCotizacion}`);
  }
  listCotizacionesAprobadas() {
    console.log("listCotizacionesAprobadas");
    return this.http
      .get(`${environment.API_URI}/agentes/listCotizacionesAprobadas`);
  }
  listCotizacionesAprobadasProductos(cotizaciones,ini,fin) {
    console.log("listCotizacionesAprobadasProductos");
    return this.http
      .get(`${environment.API_URI}/agentes/listCotizacionesAprobadasProductos/${cotizaciones}/${ini}/${fin}`);
  }
  listCotizacionAprobadasProductosSinFactura(idCotizacion,ini,fin) {
    console.log("listCotizacionesAprobadasProductos");
    return this.http
      .get(`${environment.API_URI}/agentes/listCotizacionAprobadasProductosSinFactura/${idCotizacion}/${ini}/${fin}`);
  }
  listCotizacionAprobadasProductos(idCotizacion) {
    console.log("listCotizacionAprobadasProductos");
    return this.http
      .get(`${environment.API_URI}/agentes/listCotizacionAprobadasProductos/${idCotizacion}`);
  }

  listCotizacionesByAgente(idUsuario: number) {
    return this.http
      .get(`${environment.API_URI}/agentes/listCotizacionesByAgente/${idUsuario}`);
  }

  listByIdAgencia(idAgencia: number) {
    return this.http
      .get(`${environment.API_URI}/agentes/listByIdAgencia/${idAgencia}`);
  }

  listByIdAgenciaWithAgencia(idAgencia: number) {
    return this.http
      .get(`${environment.API_URI}/agentes/listByIdAgenciaWithAgencia/${idAgencia}`);
  }

  listComisionesByIdAgente(idAgente: number) {
    return this.http
      .get(`${environment.API_URI}/agentes/listComisionesByIdAgente/${idAgente}`);
  }

  update(agente: Agente, comsionesAgente) {
    return this.http.put(`${environment.API_URI}/agentes/update/${agente.idAgente}`, [agente, comsionesAgente]);
  }


  delete(idAgente: number) {
    return this.http.delete(`${environment.API_URI}/agentes/delete/${idAgente}`);
  }

  


}
