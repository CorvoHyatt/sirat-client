import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import Swal from "sweetalert2";
import { ContactoService } from 'src/app/services/contacto.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuariosPorConfirmar: any[] = [];
  usuarios: any[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private contactoService: ContactoService
  ) { }

  ngOnInit(): void {
    this.getUsuariosPorConfirmar();
    this.getUsuariosConfirmados();
  }

  getUsuariosPorConfirmar() {
    this.usuariosService.list_porConfirmar().subscribe(
      (res: any[]) => {
        this.usuariosPorConfirmar = res;
        console.log( this.usuariosPorConfirmar);
      }
    );
  }

  getUsuariosConfirmados() {
    this.usuariosService.list_vista().subscribe(
      (res: any[]) => {
        this.usuarios = res;
        console.log( this.usuarios);
      }
    );
  }

  confirmarUsuario(correo) {
    Swal.fire({
      title: "Se confirmará este usuario registrado ¿Desea continuar?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.usuariosService.confirmarUsuario(correo).subscribe(
          res => {

            this.contactoService.enviarCorreoAcceso(res).subscribe(
              res2 => {
                this.getUsuariosPorConfirmar();
                this.getUsuariosConfirmados();
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Confirmado correctamente",
                  text: "Se le ha enviado un correo al usuario notificándole su confirmación de acceso",
                  showConfirmButton: true,
                });
              }
            );
          }
        );
      }
    });
  }

}
