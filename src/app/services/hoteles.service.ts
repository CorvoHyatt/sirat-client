import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Hotel } from '../models/hotel';
import { HotelHabitacionUpgrade } from '../models/HotelHabitacionUpgrade';
import { HotelUpgrade } from '../models/HotelUpgrade';
import { HotelHabitacion } from '../models/HotelHabitacion';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  create(hotel: Hotel) {
    let h: Hotel = this.helperService.cargarModelo(new Hotel(), hotel);
    delete h.tarifa;
    return this.http.post(`${environment.API_URI}/hoteles/create`, h);
  }
  agregarEmpresa(dato)
  {
    return this.http.post(`${environment.API_URI}/hoteles/agregarEmpresa`, dato);
  }

  agreagrHabitacion(habitacion: HotelHabitacion) {
    let h: HotelHabitacion = this.helperService.cargarModelo(new HotelHabitacion(), habitacion);
    return this.http.post(`${environment.API_URI}/hoteles/agregarHabitacion`, h);
  }

  updateHotel(hotel: Hotel){
    let h: Hotel = this.helperService.cargarModelo(new Hotel(), hotel);
    delete h.tarifa;
    return this.http.put(`${environment.API_URI}/hoteles/updateHotel/${h.idHotelAdquirido}`, h);
  }

  updateHabitacion(habitacion: HotelHabitacion){
    let h: HotelHabitacion = this.helperService.cargarModelo(new HotelHabitacion(), habitacion);
    return this.http.put(`${environment.API_URI}/hoteles/updateHabitacion/${h.idHotelHabitacion}`, h);
  }


  getCategorias(){
    return this.http.get(`${environment.API_URI}/hoteles/categorias`);
  }

  //OBTENER MEJORA DE HOTEL Y MEJORAS DE HABITACIONES
  getUpgrades(tipoHotel: number, idHotel: number, idCotizacion: number){
    //tipoHotel(1-Precargado, 2-Manual)
    return this.http.get(`${environment.API_URI}/hoteles/upgrades/${tipoHotel}/${idHotel}/${idCotizacion}`);
  }

  //AGREGAR MEJORA DE HOTEL
  upgradeHotel(hotelUpgrade: HotelUpgrade){
    let data: HotelUpgrade = this.helperService.cargarModelo(new HotelUpgrade(), hotelUpgrade);
    return this.http.post(`${environment.API_URI}/hoteles/upgradeHotel`, data);
  }

  //AGREGAR MEJORA DE HABITACIÓN
  upgradeHabitacion(upgradeHabitacion: HotelHabitacionUpgrade){
    let data: HotelHabitacionUpgrade = this.helperService.cargarModelo(new HotelHabitacionUpgrade(), upgradeHabitacion);
    return this.http.post(`${environment.API_URI}/hoteles/upgradeHabitacion`, data);
  }

  //EDITAR MEJORA DE HABITACIÓN
  updateHabitacionUpgrade(mejoraHabitacion: any){
    let data: HotelHabitacionUpgrade = this.helperService.cargarModelo(new HotelHabitacionUpgrade(), mejoraHabitacion);
    return this.http.put(`${environment.API_URI}/hoteles/updateHabitacionUpgrade/${data.idHabitacion}`, data);
  }

  //EDITAR MEJORA DE HOTEL Y MEJORAS DE HABITACIONES
  updateHotelHabitacionesUpgrade(mejoraHotel: any, mejorasHabitaciones: any){
    let mHotel: HotelUpgrade = this.helperService.cargarModelo(new HotelUpgrade(), mejoraHotel);
    let mHabitaciones = mejorasHabitaciones.map(mejora => {
      return this.helperService.cargarModelo(new HotelHabitacionUpgrade(), mejora);
    });
    return this.http.put(`${environment.API_URI}/hoteles/updateHotelHabitacionesUpgrade/${mHotel.idHotelAdquiridoUM}`, [mHotel, mHabitaciones]);
  }

  //EDITAR MEJORA DE HOTEL
  updateHotelUpgrade(mejoraHotel: any){
    let data: HotelUpgrade = this.helperService.cargarModelo(new HotelUpgrade(), mejoraHotel);
    return this.http.put(`${environment.API_URI}/hoteles/updateHotelUpgrade/${data.idHotelAdquiridoUM}`, data);
  }

  //ELIMINAR HABITACIÓN DE HOTEL
  deleteHabitacion(idHotelHabitacion: number){
    return this.http.delete(`${environment.API_URI}/hoteles/deleteHabitacion/${idHotelHabitacion}`);
  }

  //ELIMINAR MEJORA DE HOTEL
  deleteUpgradesManual(idHotelAdquirido: number){
    return this.http.delete(`${environment.API_URI}/hoteles/deleteUpgradesManual/${idHotelAdquirido}`);
  }

  //ELIMINAR MEJORA DE HABITACIÓN DB
  deleteUpgradeHabitacion(idHabitacion: number){
    return this.http.delete(`${environment.API_URI}/hoteles/deleteUpgradeHabitacion/${idHabitacion}`);
  }

  completarInfo(info: any){
    return this.http.post(`${environment.API_URI}/hoteles/completarInfo`, info);
  } 

  updateInfo(info: any){
    return this.http.put(`${environment.API_URI}/hoteles/updateInfoExtra/${info.idHotelesAdquiridosInfo}`, info);
  } 

}
