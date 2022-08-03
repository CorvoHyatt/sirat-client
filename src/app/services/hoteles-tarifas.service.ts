import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HotelTarifa } from './../models/HotelTarifa';

@Injectable({
  providedIn: 'root'
})
export class HotelesTarifasService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(`${environment.API_URI}/hotelesTarifas/list`);
  }

  listOne(id: number) {
    return this.http.get(`${environment.API_URI}/hotelesTarifas/listOne/${id}`);
  }

  pagination(inicio: number, total: number){
    return this.http.get(`${environment.API_URI}/hotelesTarifas/pagination/${inicio}/${total}`);
  }

  create(hotelTarifa: HotelTarifa) {
    return this.http.post(`${environment.API_URI}/hotelesTarifas/create`, hotelTarifa);
  }

  update(hotelTarifa: HotelTarifa){
    return this.http.put(`${environment.API_URI}/hotelesTarifas/update/${hotelTarifa.idHotelTarifa}`, hotelTarifa);
  }

  delete(id: number){
    return this.http.delete(`${environment.API_URI}/hotelesTarifas/delete/${id}`);
  }
}