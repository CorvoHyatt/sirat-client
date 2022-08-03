import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Vehiculo } from '../models/Vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private http: HttpClient) { }

  create(vehiculo: Vehiculo) {
    return this.http.post(`${environment.API_URI}/vehiculos/create`, vehiculo);
  }

  listByName(name: string) {
    return this.http.get(`${environment.API_URI}/vehiculos/listByName/${name}`);
  }
  
  list() {
    return this.http.get(`${environment.API_URI}/vehiculos/list`);
  }
  
  update(vehiculo: Vehiculo) {
    return this.http.put(`${environment.API_URI}/vehiculos/update/${vehiculo.idVehiculo}`, vehiculo);
  }

  delete(idVehiculo: number) {
    return this.http.delete(`${environment.API_URI}/vehiculos/delete/${idVehiculo}`);
  }
  
}
