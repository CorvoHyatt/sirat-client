import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Canasta } from '../models/Canasta';

@Injectable({
  providedIn: 'root'
})
export class CanastaExtrasService {
  
  private product$: Subject<any> = new Subject<any>();
  private idsToDelete$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  getListTrasladosExtras(idCotizacion,idVersion) 
  {
      //console.log("getListTrasladosExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListTrasladosExtras/${idCotizacion}/${idVersion}`);
  }
  getListOtroTrasladosExtras(idCotizacion,idVersion) 
  {
      //console.log("getListTrasladosExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListOtroTrasladosExtras/${idCotizacion}/${idVersion}`);
  }
  getListHotelesExtras(idCotizacion,idVersion) 
  {
    //console.log("getListHotelesExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListHotelesExtras/${idCotizacion}/${idVersion}`);
  }
  /*
  getListHotelesManualesExtras(idCotizacion) 
  {
    //console.log("getListHotelesManualesExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListHotelesManualesExtras/${idCotizacion}`);
  }
  */
  getListDisposicionesExtras(idCotizacion,idVersion) 
  {
    //console.log("getListDisposicionesExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListDisposicionesExtras/${idCotizacion}/${idVersion}`);
  }
  getListProductosExtras(idCotizacion,idVersion) 
  {
    //console.log("getListProductosExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListProductosExtras/${idCotizacion}/${idVersion}`);
  }
  getListProductosTrasporteExtras(idCotizacion,idVersion) 
  {
    //console.log("getListProductosTrasporteExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListProductosTrasporteExtras/${idCotizacion}/${idVersion}`);
  }
  getListTrenesExtras(idCotizacion,idVersion) 
  {
    //console.log("getListTrenesExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListTrenesExtras/${idCotizacion}/${idVersion}`);
  }
  getListVuelosExtras(idCotizacion,idVersion) 
  {
    //console.log("getListVuelosExtras");
    return this.http.get(`${environment.API_URI}/canastaExtra/getListVuelosExtras/${idCotizacion}/${idVersion}`);
  }
}
