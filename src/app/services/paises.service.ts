import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pais } from '../models/Pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(`${environment.API_URI}/paises/list`);
  }


  listDisposiciones(idContinente: number) {
    return this.http.get(`${environment.API_URI}/paises/listDisposiciones/${idContinente}`);
  }

  listTraslados(idContinente: number) {
    return this.http.get(`${environment.API_URI}/paises/listTraslados/${idContinente}`);
  }

  listProductos(idContinente: number, categoria: number) {
    return this.http.get(`${environment.API_URI}/paises/listProductos/${idContinente}/${categoria}`);
  }

  
  listByIdContinente(idContinente: number) {
    return this.http.get(`${environment.API_URI}/paises/listByIdContinente/${idContinente}`);
  }

  listOne(id: number) {
    return this.http.get(`${environment.API_URI}/paises/list_one/${id}`);
  }

  listByName(name: string) {
    return this.http.get(`${environment.API_URI}/paises/listByName/${name}`);
  }

  pagination(inicio: number, total: number){
    return this.http.get(`${environment.API_URI}/paises/pagination/${inicio}/${total}`);
  }

  create(pais: Pais){
    return this.http.post(`${environment.API_URI}/paises/create`, pais);
  }

  update(pais: Pais){
    return this.http.put(`${environment.API_URI}/paises/update/${pais.id}`, pais);
  }

  delete(id: number){
    return this.http.delete(`${environment.API_URI}/paises/delete/${id}`);
  }

  
}
