import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Jerarquia } from '../models/Jerarquia';

@Injectable({
  providedIn: 'root'
})
export class JerarquiasService {

  constructor(private http: HttpClient) { }

  create(jerarquia: Jerarquia){
    return this.http.post(`${environment.API_URI}/jerarquias/create`, jerarquia);
  }

  create_list(jerarquias: Jerarquia[]){
    return this.http.post(`${environment.API_URI}/jerarquias/create_list`, jerarquias);
  }

  list_agrupado(){
    return this.http.get(`${environment.API_URI}/jerarquias/list_agrupado`);
  }

  list_areasDisponibles(){
    return this.http.get(`${environment.API_URI}/jerarquias/list_areasDisponibles`);
  }


  getCount(idAreaPrincipal: number){
    return this.http.get(`${environment.API_URI}/jerarquias/count/${idAreaPrincipal}`);
  }

  list_areasSubordinadas(idAreaPrincipal: number){
    return this.http.get(`${environment.API_URI}/jerarquias/list_areasSubordinadas/${idAreaPrincipal}`);
  }

  update(jerarquia){
    return this.http.put(`${environment.API_URI}/jerarquias/update/${jerarquia.idAreaPrincipal}`,jerarquia);
  }

  delete(idAreaPrincipal){
    return this.http.delete(`${environment.API_URI}/jerarquias/delete/${idAreaPrincipal}`);
  }
}
