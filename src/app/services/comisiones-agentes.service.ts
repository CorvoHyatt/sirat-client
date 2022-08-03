import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComisionesAgentesService {

  constructor(private http: HttpClient) { }

  listByIdAgenteTipoActividad(idAgente: number, tipoActividad: number) {
    return this.http
      .get(`${environment.API_URI}/comisionesAgentes/listByIdAgenteTipoActividad/${idAgente}/${tipoActividad}`);
  }


}
