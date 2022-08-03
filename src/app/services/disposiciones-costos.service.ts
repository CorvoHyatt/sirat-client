import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DisposicionCosto } from '../models/DisposicionCosto';

@Injectable({
  providedIn: 'root'
})
export class DisposicionesCostosService {

  constructor(private http: HttpClient) 
  {
  }

  listByIdDisposicionIdVehiculo(idDisposicion:number, idVehiculo: number) {
    return this.http.get(`${environment.API_URI}/disposicionesCostos/listByIdDisposicionIdVehiculo/${idDisposicion}/${idVehiculo}`);
  }

  listByIdDisposicion(idDisposicion:number) {
    return this.http.get(`${environment.API_URI}/disposicionesCostos/listByIdDisposicion/${idDisposicion}`);
  }

  listOne(idDisposicionCosto: number) {
    return this.http.get(`${environment.API_URI}/disposicionesCostos/listOne/${idDisposicionCosto}`);
  }


  create_list(disposicionesCostos:DisposicionCosto[], idDisposicion: number) {
    return this.http.post(`${environment.API_URI}/disposicionesCostos/create_list/${idDisposicion}`,disposicionesCostos);
  }

  actualizar(disposicionesCostos:DisposicionCosto[], idDisposicion: number) {
    return this.http.put(`${environment.API_URI}/disposicionesCostos/actualizar/${idDisposicion}`,disposicionesCostos);
  }

}
