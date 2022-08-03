import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosExtrasConciergeService {

  constructor(private http: HttpClient) { }

  getProductosExtrasConcierge(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/productosExtrasConcierge/getProductosExtrasConcierge/${idCotizacion}`);
  }

  getProductoExtraConcierge(idProducto: number, tipo: number){
    return this.http.get(`${environment.API_URI}/productosExtrasConcierge/getProductoExtraConcierge/${idProducto}/${tipo}`);
  }

  getTotalExtrasConcierge(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/productosExtrasConcierge/getTotalExtrasConcierge/${idCotizacion}`);
  }
} 