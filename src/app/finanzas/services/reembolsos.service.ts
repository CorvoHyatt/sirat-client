import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reembolso } from '../models/Reembolso';

@Injectable({
  providedIn: 'root'
})
export class ReembolsosService {

    constructor(private http: HttpClient){ }

    create(reembolso: Reembolso){
        return this.http.post(`${environment.API_URI}/reembolsos/create`, reembolso);
    }
  
    listPorCotizacion(idCotizacion: number){
        return this.http.get(`${environment.API_URI}/reembolsos/listPorCotizacion/${idCotizacion}`);
    }
  
    getTotalReembolsos(idCotizacion: number){
        return this.http.get(`${environment.API_URI}/reembolsos/getTotalReembolsos/${idCotizacion}`);
    }
  
    getTotalReembolsoFinal(idCotizacion: number){
        return this.http.get(`${environment.API_URI}/reembolsos/getTotalReembolsoFinal/${idCotizacion}`);
    }
  
    update(idReembolso: number){
        return this.http.put(`${environment.API_URI}/reembolsos/update/${idReembolso}`, null);
    }
}
