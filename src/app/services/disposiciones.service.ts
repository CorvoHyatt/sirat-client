import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Disposicion } from '../models/Disposicion';

@Injectable({
  providedIn: 'root'
})
export class DisposicionesService {

  constructor(private http: HttpClient) 
  { 


  }

  create(disposicion: Disposicion)
  {

    return this.http.post(`${environment.API_URI}/disposiciones/create`, disposicion);
  }

  createDataComplete(disposiciones: any)
  {
    return this.http.post(`${environment.API_URI}/disposiciones/createDataComplete`, disposiciones);
  }


  // lista de todas las divisas en la BD
  listByIdCiudad(idCiudad: number) 
  {
    return this.http.get(`${environment.API_URI}/disposiciones/list/${idCiudad}`);
  }



  listByPaisCiudad_vista(idPais: number, idCiudad: number) {
    return this.http
      .get(`${environment.API_URI}/disposiciones/listByPais_vista/${idPais}/${idCiudad}`);
  }


  listVehiculosByIdDisposicion(idDisposicion: number) 
  {
    return this.http.get(`${environment.API_URI}/disposiciones/listVehiculosByIdDisposicion/${idDisposicion}`);
  }

  listOne(idDisposicion: number) {
    console.log(idDisposicion);
    return this.http.get(`${environment.API_URI}/disposiciones/listOne/${idDisposicion}`);
  }

  incrementoByDisposicionFecha(idDisposicion,fecha)
  {
    return this.http.get(`${environment.API_URI}/disposiciones/incrementoByDisposicionFecha/${idDisposicion}/${fecha}`);
  }

  incrementoByDisposicionFechaVariable(idDisposicion,fecha)
  {
    return this.http.get(`${environment.API_URI}/disposiciones/incrementoByDisposicionFechaVariable/${idDisposicion}/${fecha}`);
  }


  incrementoByDisposicionHora(idDisposicion,hora)
  {

    return this.http.get(`${environment.API_URI}/disposiciones/incrementoByDisposicionHora/${idDisposicion}/${hora}`);
  }

  actualizar(disposicion: Disposicion)
  {
    return this.http.put(`${environment.API_URI}/disposiciones/actualizar/${disposicion.idDisposicion}`, disposicion);
  }

  delete(idDisposicion: number)
  {
    return this.http.delete(`${environment.API_URI}/disposiciones/delete/${idDisposicion}`);
  }



}
