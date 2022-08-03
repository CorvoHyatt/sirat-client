import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { VueloEscala } from '../models/VueloEscala';

@Injectable({
  providedIn: 'root'
})
export class VuelosEscalasService {

  constructor(private http: HttpClient) { }

  create(vueloEscala: VueloEscala) {
    let data = {
      idVueloEscala: vueloEscala.idVueloEscala,
      idVuelo: vueloEscala.idVuelo,
      fecha: vueloEscala.fecha,
      lugar: vueloEscala.lugar,
      tiempo: vueloEscala.tiempo,
    }
    return this.http.post(`${environment.API_URI}/vuelosEscalas/create`, data);
  }

}