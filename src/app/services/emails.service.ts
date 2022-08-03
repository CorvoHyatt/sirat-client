import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmailsService {

   constructor(private http: HttpClient) { }

    nuevaCotizacion(email: any) {
      //  return this.http.post(`${this.url}/emails/nuevaCotizacion`, email);
    }

    avisosCotizacion(email: any) {
        //return this.http.post(`${this.url}/emails/avisosCotizaciones`, email);
    }
    enviarPDF(email: any) {
        console.log("enviarPDF");
        console.log(`${environment.API_URI_CORREOS}/enviarPDF`);
        return this.http.post(`${environment.API_URI_CORREOS}/enviarPDF`, email);
    }
    enviarPDFOrdenCompra(email: any) {
      console.log("enviarPDFOrdenCompra");
      return this.http.post(`${environment.API_URI_CORREOS}/enviarPDFOrdenCompra`, email);
  }

   
} 