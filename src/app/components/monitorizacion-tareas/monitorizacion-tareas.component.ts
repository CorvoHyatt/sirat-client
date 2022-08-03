import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { JerarquiasService } from '../../services/jerarquias.service';
import { Area } from '../../models/Area';
import { NotificacionesService } from '../../services/notificaciones.service';
declare var $: any;

@Component({
  selector: 'app-monitorizacion-tareas',
  templateUrl: './monitorizacion-tareas.component.html',
  styleUrls: ['./monitorizacion-tareas.component.css']
})
export class MonitorizacionTareasComponent implements OnInit {

  public idArea: number = 0;
  public idUsuario: number = -1;
  public usuario: Usuario = new Usuario();
  public areas: Area[] = [];
  public usuarios: Usuario[] = [];
  public notificaciones: any = [];
  public notificacionActual: any = {};

  constructor(
    private jerarquiasService: JerarquiasService,
    private usuariosService: UsuariosService,
    private notificacioneService: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.usuariosService.getUser().subscribe((user: any) => {
      if(Object.keys(user).length === 0) return false;
      this.usuario = user;
      this.getAreas();
    }, err => {
      console.log(err);
    });
  }


  getAreas() {
    this.jerarquiasService.list_areasSubordinadas(this.usuario.idArea).subscribe(
      (resp: Area[]) => {
        this.areas = resp;
        (this.areas.length > 0) ? this.idArea = this.areas[0].idArea : this.idArea = 0;
        this.getUsuarios();
      }
    );
  }

  getUsuarios() {
    this.usuariosService.list_byIdArea(this.idArea).subscribe(
      (resp: Usuario[]) => {
        this.usuarios = resp;
        this.idUsuario = -1;
        this.getNotificaciones();
      }
    );
  }

  getNotificaciones() {
    this.notificacioneService.listAll_ByIdAreaIdUsuario(this.idArea, this.idUsuario).subscribe(
      (resp) => {
        this.notificaciones = resp;
        console.log(this.notificaciones);
      }
    );
  }

  verNotificacionCompleta(notificacion) {
    this.notificacionActual = notificacion;
    try {
      notificacion.data = JSON.parse(notificacion.data);
    } catch(err) {
    }
    switch (notificacion.tipo) {
      case 1:
        $("#modalVerTarea").modal("open");  
        break;
      case 2:
        $("#modalVerLlamadaPendiente").modal("open");  
       break;
       case 3:
        $("#modalVerNota").modal("open");  
       break; 
    }
     
  }
}
