import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosParcialesService {

    constructor(private http: HttpClient){ }

    create(pago: any){
        return this.http.post(`${environment.API_URI}/pagosParciales/create`, pago);
    }
    historialPorProducto(pago: any)
    {
      return this.http.get(`${environment.API_URI}/pagosParciales/historialPorProducto/${pago}`);

    }
    listPagoParcial(idPagoParcial: number)
  {
    return this.http.get(`${environment.API_URI}/pagosParciales/listPagoParcial/${idPagoParcial}`);
  }
  /*
    update(idPago: number, tipo: string){
        return this.http.put(`${environment.API_URI}/pagosParciales/update/${idPago}/${tipo}`, null);
    }
    */
}
