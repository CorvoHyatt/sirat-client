import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private SECRET_KEY: String = '51R4T';
  private usuario$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.usuario$.asObservable();
  }

  setUser(value: any): void {
      this.usuario$.next(value);
  }

  getUserByEmail(correo: string){
    return this.http.get(`${environment.API_URI}/usuarios/list_oneByCorreo/${correo}`).subscribe((res: any) => {
      this.setUser(res);
    }, err => console.log(err));
  }

  guardarCorreoLS(correo: string){
    let correoCrypto = CryptoJS.AES.encrypt(JSON.stringify(correo), this.SECRET_KEY).toString();
    localStorage.setItem('correo', correoCrypto);
  }

  obtenerCorreoLS(){
    let correo = localStorage.getItem('correo');
    let bytes  = CryptoJS.AES.decrypt(correo, this.SECRET_KEY);
    let correoDecrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return correoDecrypted;
  }


  list() {
    return this.http.get(`${environment.API_URI}/usuarios/list`);
  }


  list_one(idUsuario: number) {
    return this.http.get(`${environment.API_URI}/usuarios/list_one/${idUsuario}`);
  }


  list_porConfirmar() {
    return this.http.get(`${environment.API_URI}/usuarios/list_porConfirmar`);
  }

  list_vista() {
    return this.http.get(`${environment.API_URI}/usuarios/list_vista`);
  }

  confirmarUsuario(correo: string) {
    return this.http.get(`${environment.API_URI}/usuarios/confirmarUsuario/${correo}`);
  }
  
  

  list_oneByCorreo(correo: string) {
    return this.http.get(`${environment.API_URI}/usuarios/list_oneByCorreo/${correo}`);
  }

  getUsuariosToTransfer(idUsuario: number){
    return this.http.get(`${environment.API_URI}/usuarios/getUsuariosToTransfer/${idUsuario}`);
  }

  list_byIdArea(idArea: number) {
    return this.http.get(`${environment.API_URI}/usuarios/list_byIdArea/${idArea}`);
  }

  update_estatusPorRegistrar(correo: number, estatus: number) {
    return this.http.put(`${environment.API_URI}/usuarios/update_estatusPorRegistrar/${estatus}`, {correo});
  }

  
}
