import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agencia } from '../models/Agencia';

@Injectable({
  providedIn: 'root'
})
export class AgenciasService {

  constructor(private http: HttpClient) { }

  create(agencia: Agencia) {
    return this.http.post(`${environment.API_URI}/agencias/create`, agencia);
  }
  

   list() {
    return this.http
      .get(`${environment.API_URI}/agencias/list`);
  }

  
  update(agencia: Agencia) {
    return this.http.put(`${environment.API_URI}/agencias/update/${agencia.idAgencia}`, agencia);
  }

  delete(idAgencia: number) {
    return this.http.delete(`${environment.API_URI}/agencias/delete/${idAgencia}`);
  }

}
