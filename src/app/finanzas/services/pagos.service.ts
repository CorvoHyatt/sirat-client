import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pago } from '../models/Pago';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

    constructor(private http: HttpClient){ }

    create(pago: Pago){
        return this.http.post(`${environment.API_URI}/pagos/create`, pago);
    }
  
    listPorCotizacion(idCotizacion: number){
        return this.http.get(`${environment.API_URI}/pagos/listPorCotizacion/${idCotizacion}`);
    }
  
    update(idPago: number, tipo: string){
        return this.http.put(`${environment.API_URI}/pagos/update/${idPago}/${tipo}`, null);
    }
}
