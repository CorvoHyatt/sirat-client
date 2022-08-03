import { HttpClient } from '@angular/common/http';
import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  constructor(private http: HttpClient) { }

  create(orden: any) {
    return this.http.post(`${environment.API_URI}/ordenCompra/create`, [orden]);
  }
  update(ordenActualizar: any, estado:any) {
    return this.http.put(`${environment.API_URI}/ordenCompra/update`, [ordenActualizar]);
  }

  listOne(idCotizacion: number){
    return this.http.get(`${environment.API_URI}/ordenCompra/listOne/${idCotizacion}`);
}
}
