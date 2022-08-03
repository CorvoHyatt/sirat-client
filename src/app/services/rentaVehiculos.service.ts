import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RentaVehiculo } from '../models/RentaVehiculo';
import { RentaVehiculoUpgrade } from '../models/RentaVehiculoUpgrade';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class RentaVehiculosService {

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  create(rentaVehiculo: RentaVehiculo) {
    let data: RentaVehiculo = this.helperService.cargarModelo(new RentaVehiculo(), rentaVehiculo);
    return this.http.post(`${environment.API_URI}/rentaVehiculos/create`, data);
  }

  update(rentaVehiculo: RentaVehiculo, idRentaVehiculo: number) {
    let data: RentaVehiculo = this.helperService.cargarModelo(new RentaVehiculo(), rentaVehiculo);
    return this.http.put(`${environment.API_URI}/rentaVehiculos/update/${idRentaVehiculo}`, data);
  }

  //MEJORAS
  
  createUpgrade(rentaVehiculoUpgrade: RentaVehiculoUpgrade) {
    let data: RentaVehiculo = this.helperService.cargarModelo(new RentaVehiculoUpgrade(), rentaVehiculoUpgrade);
    return this.http.post(`${environment.API_URI}/rentaVehiculos/createUpgrade`, data);
  }

  getUpgrade(idRentaVehiculo: number) {
    return this.http.get(`${environment.API_URI}/rentaVehiculos/getUpgrade/${idRentaVehiculo}`);
  }

  updateUpgrade(rentaVehiculoUpgrade: RentaVehiculoUpgrade, idRentaVehiculoUpgrade: number) {
    let data: RentaVehiculo = this.helperService.cargarModelo(new RentaVehiculoUpgrade(), rentaVehiculoUpgrade);
    return this.http.put(`${environment.API_URI}/rentaVehiculos/updateUpgrade/${idRentaVehiculoUpgrade}`, data);
  }

  deleteUpgrade(idRentaVehiculoUpgrade: number, nombre: string) {
    return this.http.delete(`${environment.API_URI}/rentaVehiculos/deleteUpgrade/${idRentaVehiculoUpgrade}/${nombre}`);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/rentaVehiculos/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/rentaVehiculos/updateInfoExtra/${info.idRentaVehiculoInfo}`, info);
  } 

  
}
