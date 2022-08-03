import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Canasta } from '../models/Canasta';

@Injectable({
  providedIn: 'root'
})
export class CanastaService {
  
  private product$: Subject<any> = new Subject<any>();
  private idsToDelete$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  public getProduct(): Observable<any> {
    return this.product$.asObservable();
  }

  public addProduct(value: any): void {
    this.product$.next(value);
  }

  public getIdsToDelete(): Observable<any> {
    return this.idsToDelete$.asObservable();
  }

  public addIdsToDelete(value: any): void {
    this.idsToDelete$.next(value);
  }

  create(canasta: Canasta) {
    return this.http.post(`${environment.API_URI}/canasta/create`,canasta);
  }

  listIdActividadesByIdCotizacionByTipo(idCotizacion, tipo) {
    return this.http.get(`${environment.API_URI}/canasta/listIdActividadesByIdCotizacionByTipo/${idCotizacion}/${tipo}`);
  }

  listOneCotizacionByUser(idUser: number, idCotizacion: number) {
    return this.http.get(`${environment.API_URI}/canasta/listOneCotizacionByUser/${idUser}/${idCotizacion}`);
  }

  listOneCotizacionByUserByVersion(idUser: number, idCotizacion: number, versionCotizacion: number) {
    return this.http.get(`${environment.API_URI}/canasta/listOneCotizacionByUserByVersion/${idUser}/${idCotizacion}/${versionCotizacion}`);
  }
  listOneCotizacionByUserByVersionResumen(idUser: number, idCotizacion: number, versionCanasta: number, versionCotizacion: number) {
    return this.http.get(`${environment.API_URI}/canasta/listOneCotizacionByUserByVersionResumen/${idUser}/${idCotizacion}/${versionCanasta}/${versionCotizacion}`);
  }
  updateStatus(idCotizacion: number, estatus: any){
    return this.http.put(`${environment.API_URI}/canasta/updateStatus/${idCotizacion}`, estatus);
  }

  deleteProduct(idProduct: number, idCotizacion: number, type: string){
    return this.http.delete(`${environment.API_URI}/canasta/deleteProduct/${idProduct}/${idCotizacion}/${type}`);
  }

  cancelarCotizacion(idCotizacion: number, idsToDelete7: any){
    return this.http.delete(`${environment.API_URI}/canasta/cancelarCotizacion/${idCotizacion}/${idsToDelete7}`);
  }
}
