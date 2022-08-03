import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriasService {

  constructor(private http: HttpClient) { }

  list() {
    return this.http
      .get(`${environment.API_URI}/subcategorias/list`);
  }

  listByCategoria(idCategoria: number) {
    return this.http
      .get(`${environment.API_URI}/subcategorias/listByCategoria/${idCategoria}`);
  }


  listByCategoriaCiudad(categoria: number, idCiudad: number) {
    return this.http
      .get(`${environment.API_URI}/subcategorias/listByCategoriaCiudad/${categoria}/${idCiudad}`);
  }


}
