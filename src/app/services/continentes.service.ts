import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContinentesService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http
      .get(`${environment.API_URI}/continentes/list`);
  }

  listDisposiciones() {
    return this.http
      .get(`${environment.API_URI}/continentes/listDisposiciones`);
  }


  listTraslados() {
    return this.http
      .get(`${environment.API_URI}/continentes/listTraslados`);
  }

  listProductos(categoria: number) {
    return this.http
      .get(`${environment.API_URI}/continentes/listProductos/${categoria}`);
  }
}
