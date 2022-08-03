import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosParcialesService {

  constructor(private http: HttpClient) { }

  historialPorProducto(idProductoCosto: number) {
    return this.http.get(`${environment.API_URI}/pagosParciales/historialPorProducto/${idProductoCosto}`);
  }

  listPagoParcial(idPagoParcial: number){
    return this.http.get(`${environment.API_URI}/pagosParciales/listPagoParcial/${idPagoParcial}`);
  }
}
