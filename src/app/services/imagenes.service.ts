import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(private http: HttpClient) { }

  uploadPasaporte(file: any, name: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadPasaporte`, {'file': file, 'name': name});
  }
  uploadImagenesCotizaciones(file: any, name: string, idCotizacion: number, notas: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenesCotizaciones`, {'file': file, 'name': name, 'idCotizacion': idCotizacion, 'notas': notas});
  }
  uploadImagenesRentaVehiculos(idRentaVehiculo: number, file: any, nombre: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenesRentaVehiculos`, {'file': file, 'nombre': nombre, 'idRentaVehiculo': idRentaVehiculo});
  }
  uploadImagenesRentaVehiculosUpgrade(idRentaVehiculoUpgrade: number, file: any, nombre: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenesRentaVehiculosUpgrade`, {'file': file, 'nombre': nombre, 'idRentaVehiculoUpgrade': idRentaVehiculoUpgrade});
  }
  updateImagenRentaVehiculos(file: any, nombre: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/updateImagenRentaVehiculos`, {'file': file, 'nombre': nombre});
  }
  uploadPDFsCotizaciones(file: any, name: string, idCotizacion: number, notas: string) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadPDFsCotizaciones`, {'file': file, 'name': name, 'idCotizacion': idCotizacion, 'notas': notas});
  }
  guardarPDF(idCotizacion, versionCotizacion,src){
    console.log("guardarPDF");
    return this.http.post(`${environment.API_URI_IMAGES}/uploadPDF`, {"idCotizacion": idCotizacion, "versionCotizacion":versionCotizacion,"src": src});
  }
  guardarFactura(extFact,src){
    console.log("guardarFactura");
    return this.http.post(`${environment.API_URI_IMAGES}/uploadFactura`, {"extFact": extFact,"src": src});
  }
  guardarPDFOrdenCompra(idCotizacion, src){
    console.log("guardarPDFOrdenCompra");
    return this.http.post(`${environment.API_URI_IMAGES}/uploadPDFOrdenCompra`, {"idCotizacion": idCotizacion, "src": src});
  }
  guardarImagenPrincipal(idCotizacion, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenPrincipal`, {"idCotizacion": idCotizacion, "src": src});
  }
  guardarImagenEvento(idCotizacion, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenEvento`, {"idCotizacion": idCotizacion, "src": src});
  }
  guardarImagenDaybyday(idCotizacion, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenDaybyday`, {"idCotizacion": idCotizacion, "src": src});
  }
  guardarImagenFin(idCotizacion, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenFin`, {"idCotizacion": idCotizacion, "src": src});
  }
  guardarImagenHotel1(id, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenHotel1`, {"idHotel": id, "src": src});
  }
  guardarImagenHotel2(id, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenHotel2`, {"idHotel": id, "src": src});
  }
  guardarActualizacionImagenHotel1(id, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadActualizacionImagenHotel1`, {"idHotel": id, "src": src});
  }
  guardarActualizacionImagenHotel2(id, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadActualizacionImagenHotel2`, {"idHotel": id, "src": src});
  }

  guardarImagenItinerarioFinal(idCotizacion, src){
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImagenItinerarioFinal`, {"idCotizacion": idCotizacion, "src": src});
  }

  uploadCiudad(files: any, idCiudad: number) {
    
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImgCiudad`, {files,idCiudad});
  }

  refreshCiudad(files: any, idCiudad: number) {
    return this.http.post(`${environment.API_URI_IMAGES}/refreshImgCiudad`, {files,idCiudad});
  }

 
  uploadProducto(files: any, idProducto: number) {
    return this.http.post(`${environment.API_URI_IMAGES}/uploadImgProducto`, {files,idProducto});
  }
  
}
