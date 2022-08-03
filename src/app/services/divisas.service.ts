import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DivisasService {

  constructor(private http: HttpClient){}

  // lista de todas las divisas en la BD
  getAll() 
  {
    return this.http.get(`${environment.API_URI}/divisas/list`);
  }

  listByName(name: string) {
    return this.http.get(`${environment.API_URI}/divisas/listByName/${name}`);
  }

  getOne(id) 
  {
    return this.http.get(`${environment.API_URI}/divisas/list/${id}`);
  }


  divisaBase_getOne(id) 
  {
    return this.http.get(`${environment.API_URI}/divisas/divisaBase_getOne/${id}`);
  }

}
  