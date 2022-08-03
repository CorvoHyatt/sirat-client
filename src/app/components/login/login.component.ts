import { Component, OnInit } from "@angular/core";
import { logging } from "protractor";
import { UsuariosService } from "../../services/usuarios.service";
import { Usuario } from "../../models/Usuario";
import { Router } from "@angular/router";
declare var $: any;
import Swal from "sweetalert2";
import { AuthService } from "../../services/auth.service";
import { AreasService } from '../../services/areas.service';
import { Area } from '../../models/Area';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: any = new Usuario();
  correoRepeat = ``;
  passwordRepeat = ``;
  public areas: Area[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private authService: AuthService,
    private areasService: AreasService,
    private contactoService: ContactoService
  ) {}

  ngOnInit(): void {
    $(".modal").modal();
    this.getAreas();
  }

  getAreas() {
    this.areasService.list().subscribe((resp: Area[]) => {
      this.areas = resp;
    });
  }

  login() {
    this.authService.signin(this.usuario).subscribe((res: any) => {
      if(res == `Falso`){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Correo o contraseña incorrecto",
          showConfirmButton: true,
        });
      }else{
        localStorage.setItem(`token`, res.token);
        this.usuariosService.guardarCorreoLS(res.correo);
        localStorage.setItem(`privilegios`, res.privilegios);
        this.usuariosService.getUserByEmail(res.correo);
        switch(res.privilegios){
          case 2:
            this.router.navigate([`administrador`]);
            break;
          case 3:
            this.router.navigate([`/home/gerenteVentas`]);
            break;
          case 4:
            this.router.navigate([`/finanzas/inicio`]);
            break;
          default:
            localStorage.removeItem('idCotizacion');
            localStorage.removeItem('fechaInicio');
            localStorage.removeItem('fechaFinal');
            this.router.navigate(['home/disenoCotizacion']);
            break;
        }
      }
    });
  }

  singup() {
    this.usuario.estatus = 0;
    if (this.usuario.correo == this.correoRepeat) {
      if (this.usuario.password == this.passwordRepeat) {
        this.authService.signupPorRegistrar(this.usuario).subscribe((res) => {
          if (res == 1) {
            this.usuario = new Usuario();
            $("#modalRegistro").modal("close");
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Correo electrónico existente",
              text:
                "Espera a que la administración de SIRAT acepte tu ingreso, se te enviará un correo de confirmación al correo electrónico que ingresaste",
              showConfirmButton: true,
            });
          } else if (res == 2) {
            this.usuario = new Usuario();
            $("#modalRegistro").modal("close");
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Correo electrónico ya registrado",
              text: "El correo electrónico ingresado ya esta registrado",
              showConfirmButton: true,
            });
          } else {

            this.contactoService.enviarCorreoConfirmacion(this.usuario).subscribe(
              res=>{
                this.usuario = new Usuario();
                $("#modalRegistro").modal("close");
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Tu cuenta ha sido creada correctamente",
                  text:
                    "Ahora espera a que la administración de SIRAT acepte tu ingreso, se te enviará un correo de confirmación al correo electrónico que ingresaste",
                  showConfirmButton: true,
                });
              }
            );

            
          }
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Las contraseñas ingresadas no coincide, varificalas",
          showConfirmButton: true,
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Los correos ingresado no coincide, verificalos",
        showConfirmButton: true,
      });
    }
  }
}
