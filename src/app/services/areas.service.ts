import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Area } from '../models/Area';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private http: HttpClient) { }

  create(area: Area) {
    return this.http.post(`${environment.API_URI}/areas/create`, area);
  }
  
  list() {
    return this.http.get(`${environment.API_URI}/areas/list`);
  }
  
  eliminar(idArea: number) {
    return this.http.delete(`${environment.API_URI}/areas/eliminar/${idArea}`);
  }
  
  actualizar(area: Area) {
    return this.http.put(`${environment.API_URI}/areas/actualizar/${area.idArea}`, area);
  }
}
