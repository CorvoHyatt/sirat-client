import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Reembolso } from '../models/Reembolso';

@Injectable({
  providedIn: 'root'
})
export class ComisionesPagadasService {

    constructor(private http: HttpClient){ }

    create(comision: Reembolso){
        return this.http.post(`${environment.API_URI}/comisionesPagadas/create`, comision);
    }
  
    listPorCotizacion(idCotizacion: number){
        return this.http.get(`${environment.API_URI}/comisionesPagadas/listPorCotizacion/${idCotizacion}`);
    }
  
    update(idComision: number, tipo: string){
        return this.http.put(`${environment.API_URI}/comisionesPagadas/update/${idComision}/${tipo}`, null);
    }
}
