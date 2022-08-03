import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductosPreciosTotales } from './../models/ProductosPreciosTotales';

@Injectable({
  providedIn: 'root'
})
export class ProductosPreciosTotalesService {

  constructor(private http: HttpClient) { }

  create(productoPrecio: ProductosPreciosTotales) {
    return this.http.post(`${environment.API_URI}/preciosTotales/create`, productoPrecio);
  }
} 