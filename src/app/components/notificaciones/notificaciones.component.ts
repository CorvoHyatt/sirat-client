import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PusherService } from 'src/app/services/pusher.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var $: any;

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  @Output() countNotifications = new EventEmitter<number>();
  public notificaciones: any[] = [];
  public usuario: Usuario = new Usuario();
  
  constructor(
    private pusherService: PusherService,
    private cotizacionesService: CotizacionesService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.getUsuario();
    $(".modal").modal();
  }

  getUsuario() {
    // this.usuariosService.list_oneByCorreo(localStorage.getItem('correo')).subscribe((resp: Usuario) => {
    this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
      this.getNotificationsByUser();
      this.pusher();
    });
  }

  countNot(value: number) {
    this.countNotifications.emit(value);
  }

  pusher(){
    let channel = `channel-notification-${this.usuario.idUsuario}`;
    let event = `new-notification-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channel, [event], (data: any) => {
      // console.log(data);
      this.notificaciones.unshift(data.nota);
      let count = this.notificaciones.length;
      this.countNot(count);
    });
  }

  getNotificationsByUser(){
    this.cotizacionesService.getNotificationsByUser(this.usuario.idUsuario).subscribe(
    (res: any) => {
      this.notificaciones = res;
      let count = this.notificaciones.length;
      this.countNot(count);
    },
    err => {
      console.log(err);
    }
    )
  }

  // selectedNotification(idNotification, idDoctor){
  //   this.notifications.find((notification) => {
  //     if(notification._id == idNotification && notification.read == false){
  //       notification.read = true;
  //       this._notificationService.updateNotification(idNotification, idDoctor).subscribe(
  //         res => {
  //           console.log(res);
  //         },
  //         err => {
  //           console.log(<any>err);
  //         }
  //       );
  //     }
  //   });
  //   this._router.navigate(['/tableMedical', idDoctor]);
  // }

  mostrarAgregarNuevaTareaPendiente() {
    $("#modalNuevaTareaPendiente").modal("open");
  }

}
