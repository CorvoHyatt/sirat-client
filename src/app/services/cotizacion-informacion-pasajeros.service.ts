import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionInformacionPasajerosService {

  constructor(private http: HttpClient) { }

  get(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/cotizaciones-informacion-pasajeros/get/${idCotizacion}`);
  }

  create(info: any) {
    return this.http.post(`${environment.API_URI}/cotizaciones-informacion-pasajeros/create`, info);
  }

  update(info: any) {
    return this.http.put(`${environment.API_URI}/cotizaciones-informacion-pasajeros/update/${info.idCotizacionInformacionPasajero}`, info);
  }
}
