import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lugar } from 'src/app/models/Lugar';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  constructor(private http: HttpClient) { }

  create(lugar: Lugar){
    return this.http.post(`${environment.API_URI}/lugares/create`, lugar);
  }

  list() {
    return this.http.get(`${environment.API_URI}/lugares/list`);
  }

  listByName(name: string) {
    return this.http.get(`${environment.API_URI}/lugares/listByName/${name}`);
  }
  
}
