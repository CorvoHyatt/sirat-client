import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private http: HttpClient) {  
  }

  enviarCorreoConfirmacion(body)
  {
    console.log("enviarCorreoRegistro");
    console.log(environment.API_URI_CORREOS);
    console.log(body);

    return this.http.post(`${environment.API_URI_CORREOS}/correoConfirmacion/`,body);
  }

  enviarCorreoAcceso(body)
  {
    console.log("enviarCorreoRegistro");
    console.log(environment.API_URI_CORREOS);
    console.log(body);

    return this.http.post(`${environment.API_URI_CORREOS}/correoAcceso/`,body);
  }

}
