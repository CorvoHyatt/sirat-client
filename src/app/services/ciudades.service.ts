import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ciudad } from '../models/Ciudad';

@Injectable({
  providedIn: 'root'
})
export class CiudadesService {

  constructor(private http: HttpClient) { }
  
  create(ciudad: Ciudad) {
    return this.http.post(`${environment.API_URI}/ciudades/create`, ciudad);
  }

  list_porPais(idPais: number) {
    console.log("list_porPais");
    return this.http
      .get(`${environment.API_URI}/ciudades/list_porPais/${idPais}`);
  }

  listImagenesExistentes(idCiudad: number, tipo: number) {
    console.log("list_porPais");
    return this.http
      .get(`${environment.API_URI}/ciudades/listImagenesExistentes/${idCiudad}/${tipo}`);
  }

  list_porPaisDisposiciones(idPais: number) {
    console.log("list_porPaisDisposiciones");
    return this.http
      .get(`${environment.API_URI}/ciudades/list_porPaisDisposiciones/${idPais}`);
  }

  list_porPaisTraslados(idPais: number) {
    console.log("list_porPaisDisposiciones");
    return this.http
      .get(`${environment.API_URI}/ciudades/list_porPaisTraslados/${idPais}`);
  }


  list_porPaisProductos(idPais: number, categoria: number) {
    console.log("list_porPaisDisposiciones");
    return this.http
      .get(`${environment.API_URI}/ciudades/list_porPaisProductos/${idPais}/${categoria}`);
  }


  list_one(idCiudad: number) {
    return this.http
      .get(`${environment.API_URI}/ciudades/list_one/${idCiudad}`);
  }

  listByName(name: string) {
    return this.http.get(`${environment.API_URI}/ciudades/listByName/${name}`);
  }


  listByNameCityNameCountry(nameCity: string, nameCountry: string) {
    return this.http.get(`${environment.API_URI}/ciudades/listByNameCityNameCountry/${nameCity}/${nameCountry}`);
  }

  listOneWithCountry(idPais: number) {
    return this.http.get(`${environment.API_URI}/ciudades/list_one_with_country/${idPais}`);
  }

  listOneWithContinent(idCiudad: number) {
    return this.http.get(`${environment.API_URI}/ciudades/listOneWithContinent/${idCiudad}`);
  }

  list() {
    return this.http.get(`${environment.API_URI}/ciudades/list`);
  }

  update(ciudad: Ciudad) {
    return this.http.put(`${environment.API_URI}/ciudades/update/${ciudad.idCiudad}`, ciudad);
  }

  delete(idCiudad: number) {
    return this.http.delete(`${environment.API_URI}/ciudades/delete/${idCiudad}`);
  }

  
}
