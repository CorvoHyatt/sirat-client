import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosVentaService {

    constructor(private http: HttpClient){ }
  
    getProductosVenta(idCotizacion: number, versionCotizacion: number, filtro: number){
        return this.http.get(`${environment.API_URI}/productosVenta/getProductosVenta/${idCotizacion}/${versionCotizacion}/${filtro}`);
    }
  
    actualizarEstadoProducto(idProducto: number, tabla: string, primaryKey: string, estado: number){
        return this.http.put(`${environment.API_URI}/productosVenta/actualizarEstadoProducto/${idProducto}/${tabla}/${primaryKey}/${estado}`, null);
    }
  
    actualizarEliminacionProducto(idProducto: number, tabla: string, primaryKey: string, eliminado: number){
        return this.http.put(`${environment.API_URI}/productosVenta/actualizarEliminacionProducto/${idProducto}/${tabla}/${primaryKey}/${eliminado}`, null);
    }

}
