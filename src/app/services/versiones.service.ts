import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Version } from '../models/Version';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {
  constructor(private http: HttpClient) { }

  create(version: Version) {
    return this.http.post(`${environment.API_URI}/version/create`, version);
  }

  getLastVersion(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/version/getLastVersion/${idCotizacion}`);
  }
  
}
