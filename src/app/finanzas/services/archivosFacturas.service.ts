import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchivosFacturasService {

    constructor(private http: HttpClient){ }

    uploadArchivosFactura(file: any, name: string, idReintegro: number, tipoReintegro: number) {
        return this.http.post(`${environment.API_URI_IMAGES}/uploadArchivosFactura`, {'file': file, 'name': name, 'idReintegro': idReintegro, 'tipoReintegro': tipoReintegro});
    }

    listNombreArchivosFactura(idReintegro: number, tipoReintegro){
        return this.http.get(`${environment.API_URI}/archivosFacturas/listNombreArchivosFactura/${idReintegro}/${tipoReintegro}`);
    }
}
