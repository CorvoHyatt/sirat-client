import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cotiz_dest_version } from '../models/cotiz_dest_version';
import { Destino } from '../models/Destino';

@Injectable({
  providedIn: 'root'
})
export class DestinosService {

  private destino$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private nuevoDestino$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private nuevoDestinoNV$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  getActualDestino(): Observable<any> {
    return this.destino$.asObservable();
  }

  setActualDestino(value: any): void {
    this.destino$.next(value);
  }

  getNuevoDestino(): Observable<any> {
    return this.nuevoDestino$.asObservable();
  }

  setNuevoDestino(value: any): void {
    this.nuevoDestino$.next(value);
  }

  sendNuevoDestinoNV(value: any): void {
    this.nuevoDestinoNV$.next(value);
  }

  getNuevoDestinoNV(): Observable<any> {
    return this.nuevoDestinoNV$.asObservable();
  }

  create(destino: Destino) {
    return this.http.post(`${environment.API_URI}/destinos/create`,destino);
  }

  create_version(cotiz_dest_version: Cotiz_dest_version) {
    return this.http.post(`${environment.API_URI}/destinos/create_version`,cotiz_dest_version);
  }

  list_porCotizacion(idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/destinos/list_porCotizacion/${idCotizacion}`);
  }

  list_one(idDestino: number) {
    return this.http.get(`${environment.API_URI}/destinos/list_one/${idDestino}`);
  }

  listOneWithCotizacion(idDestino: number) {
    return this.http.get(`${environment.API_URI}/destinos/list_one_with_cotizacion/${idDestino}`);
  }

}
