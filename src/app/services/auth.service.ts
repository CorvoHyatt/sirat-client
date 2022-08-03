import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  singup(usuario: Usuario) {
    return this.http.post(`${environment.API_URI}/auth/signup`, usuario);
  }

  signupPorRegistrar(usuario: Usuario) {
    return this.http.post(`${environment.API_URI}/auth/signupPorRegistrar`, usuario);
  }

  signin(usuario: Usuario) {
    return this.http.post(`${environment.API_URI}/auth/signin`, usuario);
  }

  isLogged() {
    if(localStorage.getItem('token') && localStorage.getItem('correo')){
      return true;
    }
    return false;
  }

  isLoggedAdmin() {
    let privilegio = parseInt(localStorage.getItem('privilegios'));
    if(localStorage.getItem('token') && localStorage.getItem('correo') && privilegio && privilegio === 2){
      return true;
    }
    return false;
  }

  isLoggedFinanzas() {
    let privilegio = parseInt(localStorage.getItem('privilegios'));
    if(localStorage.getItem('token') && localStorage.getItem('correo') && privilegio && privilegio === 4){
      return true;
    }
    return false;
  }

  decodificarMail(user)
  {
    console.log("user", user);
    console.log(environment.API_URI);
    return this.http.post(`${environment.API_URI}/auth/decodificarMail`, {user});
  }

}
