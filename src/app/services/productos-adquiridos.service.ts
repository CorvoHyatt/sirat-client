import { Injectable } from '@angular/core';
import { ProductoAdquirido } from '../models/ProductoAdquirido';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductoOpcion } from '../models/ProductoOpcion';
import { ProductoTransporte } from '../models/productoTransporte';
import { ProductoOpcionAdquiridaUpgrade } from '../models/ProductoOpcionAdquiridaUpgrade';
import { ProductoTransporteUpgrade } from '../models/ProductoTransporteUpgrade';

@Injectable({
  providedIn: 'root'
})
export class ProductosAdquiridosService {

  constructor(private http: HttpClient) { }
  create(productoAdquirido: ProductoAdquirido, productoOpcionesAdquirido?: ProductoOpcion[], productoTransporte?: ProductoTransporte[], mejoras?: ProductoOpcionAdquiridaUpgrade[], mejorasTransportes?: ProductoTransporteUpgrade[]) {
    let productA = {
      idProductoAdquirido: 0,
      idProducto: productoAdquirido.idProducto,
      fecha: productoAdquirido.fecha,
      horario: productoAdquirido.horario,
      horasExtras: productoAdquirido.horasExtras,
      guiaAcademico: productoAdquirido.guiaAcademico,
      notas: productoAdquirido.notas,
      descripcion: productoAdquirido.descripcion,
      choferGuia: productoAdquirido.choferGuia,
      freeTour: productoAdquirido.freeTour,
      guiaEspecializado: productoAdquirido.guiaEspecializado,
      audioguia: productoAdquirido.audioguia,
      tarifa: productoAdquirido.tarifa,
      comision: productoAdquirido.comision,
      comisionAgente: productoAdquirido.comisionAgente,
      opcional: productoAdquirido.opcional

    }
    return this.http.post(`${environment.API_URI}/productosAdquiridos/create`, [{ "productoAdquirido": productA, "productoOpcionesAdquirido": productoOpcionesAdquirido, "productoTransporte": productoTransporte, "mejoras": mejoras, "mejorasTransportes": mejorasTransportes }]);
  }
  
  listOne(idProductoAdquirido: number) {
    return this.http.get(`${environment.API_URI}/productosAdquiridos/listOne/${idProductoAdquirido}`);
  }
  
  
  update(productoAdquirido: any, productoOpcionesAdquirido?: ProductoOpcion[], productoTransporte?: ProductoTransporte[], mejoras?: ProductoOpcionAdquiridaUpgrade[], mejorasTransportes?: ProductoTransporteUpgrade[]) {
    let productA = {
      idProductoAdquirido: productoAdquirido.idProductoAdquirido,
      idProducto: productoAdquirido.idProducto,
      fecha: productoAdquirido.fecha,
      horario: productoAdquirido.horario,
      horasExtras: productoAdquirido.horasExtras,
      guiaAcademico: productoAdquirido.guiaAcademico,
      notas: productoAdquirido.notas,
      descripcion: productoAdquirido.descripcion,
      choferGuia: productoAdquirido.choferGuia,
      freeTour: productoAdquirido.freeTour,
      guiaEspecializado: productoAdquirido.guiaEspecializado,
      audioguia: productoAdquirido.audioguia,
      tarifa: productoAdquirido.tarifa,
      comision: productoAdquirido.comision,
      comisionAgente: productoAdquirido.comisionAgente,
      opcional: productoAdquirido.opcional,
      total : productoAdquirido.total,
      idCotizacion : productoAdquirido.idCotizacion,
      precioPorPersona: productoAdquirido.precioPorPersona
    }

  
     return this.http.put(`${environment.API_URI}/productosAdquiridos/update/${productA.idProductoAdquirido}`, [{ "productoAdquirido": productA, "productoOpcionesAdquirido":productoOpcionesAdquirido, "productoTransporte":productoTransporte, "mejoras": mejoras, "mejorasTransportes": mejorasTransportes}]);
  }
  

  getOpcionesAdquiridas(idProductoAdquirido: number) {
    return this.http
      .get(`${environment.API_URI}/productosAdquiridos/getOpcionesAdquiridas/${idProductoAdquirido}`);
  }

  getTransporteAdquirido(idProductoAdquirido: number) {
    return this.http
      .get(`${environment.API_URI}/productosAdquiridos/getTransporteAdquirido/${idProductoAdquirido}`);
  }

  getMejorasOpciones(idProductoAdquirido: number) {
    return this.http
      .get(`${environment.API_URI}/productosAdquiridos/getMejorasOpciones/${idProductoAdquirido}`);
  }

  getMejorasTransporte(idProductoAdquirido: number) {
    return this.http
      .get(`${environment.API_URI}/productosAdquiridos/getMejorasTransporte/${idProductoAdquirido}`);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/productosAdquiridos/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/productosAdquiridos/updateInfoExtra/${info.idProductosAdquiridosInfo}`, info);
  } 

}
