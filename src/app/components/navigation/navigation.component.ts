import { Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import * as M from 'materialize-css/dist/js/materialize';
import { Area } from 'src/app/models/Area';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { HelperAuthService } from '../../administrador/services/helperAuth.service';
import { Notificacion } from '../../models/Notificacion';
import { AreasService } from '../../services/areas.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import Swal from "sweetalert2";
import { PusherService } from 'src/app/services/pusher.service';
import { JerarquiasService } from '../../services/jerarquias.service';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css','./style_imprimir.css'],
  providers: [HelperAuthService]
})
export class NavigationComponent implements OnInit {
  public isAuth: boolean = false;
  public privilegios: number = 0;
  public count: number = 0;
  public notificacion: Notificacion = new Notificacion();
  public usuario: Usuario = new Usuario();
  public areas: Area[];
  public idArea = 0;
  public usuarios: Usuario[] = [];
  public nueva = false;
  public noFinalizadas: number = 0;
  public noFinalizadasTPLPNotas: any = {};
  public areasSinFinalizar: any = {};
  public notificaciones: any = [];
  public recordatoriosArray: any[] = [];
  public countAreas: number = 0;
  
  constructor(
    private _helperAuthService: HelperAuthService,
    private router: Router,
    private usuariosService: UsuariosService,
    private areasService: AreasService,
    private notificacionesService: NotificacionesService,
    private pusherService: PusherService,
    private jerarquiasService: JerarquiasService

  ) { }

  ngOnInit() {
    $('.collapsible').collapsible();
    this.getUserByEmail();
    $(document).ready(function(){
      $('.modal').modal({dismissible: true});
      $('.sidenav').sidenav();
      $(".dropdowns-menu").dropdown({
        alignment: 'left',
        coverTrigger: false,
        // hover: true,
        constrainWidth: false
      });
    });
    this.getStatusAuth();
    const options= {};
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
    this.privilegios = parseInt(localStorage.getItem(`privilegios`));
    this.getUser();
    this.getAreas();
  }

  getUserByEmail(){
    this.usuariosService.getUserByEmail(this.usuariosService.obtenerCorreoLS());
  }

  getUser(){
    this.usuariosService.getUser().subscribe((user: any) => {
      if(Object.keys(user).length === 0) return false;
      this.usuario = user;
      this.notificacion.receptor = this.usuario.idUsuario;
      this.pusher();
      this.recordatorios();
      this.getNoFinalizadas();
      this.getCountAreas();
      this.listNotificaciones();
    }, err => console.log(err));
  }

  getAreas() {
    this.areasService.list().subscribe((resp: Area[]) => {
      this.areas = resp;
      this.idArea = this.areas[0].idArea;
      this.getUsuarios();
    });
  }

  getUsuarios() {
    this.usuariosService.list_byIdArea(this.idArea).subscribe((resp: Usuario[]) => {
      //console.log(this.usuarios);
      this.usuarios = resp;
     
    });
  }

  getNoFinalizadas() {
    this.notificacionesService.count_sinFinalizar(this.usuario.idUsuario).subscribe((res: number) => {
      this.noFinalizadas = res;
    });
  }

  getNoFinalizadasTPLPNotas() {
    this.notificacionesService.count_sinFinalizarTPLPNotas(this.usuario.idUsuario).subscribe((res: any) => {
      this.noFinalizadasTPLPNotas = res;
    });
  }

  countNotifications(count: number){
    this.count = count;
  }

  getStatusAuth(){
    this._helperAuthService.getStatusAuth().subscribe(
      auth => {
        this.isAuth = auth;
      }
    );
  }

  listNotificaciones() {
    this.nueva = false;
    this.notificacionesService.count_sinFinalizarTPLPNotas(this.usuario.idUsuario).subscribe((res: any) => {
      this.noFinalizadasTPLPNotas = res;
    });
  }

  mostrarModalNotificaciones() {
    this.nueva = false;
    this.notificacionesService.count_sinFinalizarTPLPNotas(this.usuario.idUsuario).subscribe((res: any) => {
      this.noFinalizadasTPLPNotas = res;
    });
  }

  mostrarVerTareasPendientes() {
    $("#modalNotificaciones").modal("close");
    this.notificacionesService.list_AreasSinFinalizar(this.usuario.idUsuario, 0, 1).subscribe(
      (resp: any) => {
        this.areasSinFinalizar = resp;
        if(this.areasSinFinalizar.length>0)
        this.idArea = this.areasSinFinalizar[0].idArea;
        this.getNotificionesPorArea(1);
        $("#modalVerTareasPendientes").modal("open");
      }
    );
  }

  getNotificionesPorArea(tipo: number) {
    this.notificacionesService.listAll_ByIdUsuarioEstatusTipoArea(this.usuario.idUsuario, 0, tipo, this.idArea).subscribe((resp: any)=>{
      this.notificaciones = resp;
    });
  }

  mostrarAgregarNuevaTareaPendiente() {
    $("#modalNotificaciones").modal("close");
    $("#modalNuevaTareaPendiente").modal("open");
  }

  enviarNotificacion(tipo) {
    this.notificacion.emisor = this.usuario.idUsuario;
    this.notificacion.tipo = tipo;
    this.notificacionesService.create(this.notificacion, this.idArea).subscribe(
      resp => {
        switch (this.notificacion.tipo) {
          case 1:
            $("#modalNuevaTareaPendiente").modal("close");
            break;
          
          case 2:
              $("#modalNuevaLlamadaPendiente").modal("close");
            break;
          
          case 3:
              $("#modalNuevaNota").modal("close");
              break;
        }
        this.notificacion = new Notificacion();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Notificación enviada correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    );
  }

  pusher(){
    let channel = `channel-notification-${this.usuario.idUsuario}`;
    let event = `new-notification-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channel, [event], (data: any) => {
      //console.log(data);
      data.notificacion.data = JSON.parse(data.notificacion.data);
      var toastHTML = ``;
      //console.log(data.notificacion.prioridad);
      switch (data.notificacion.tipo) {
        case 1:

          switch (data.notificacion.prioridad) {
            case 1:
              //console.log(`entra 1`);
              toastHTML = `
              <p style="display: block;">
              <span>
              <b style="color:green;" >
              ¡Tarea nueva!
              </b>
              </span>
              <br> <span>${(data.notificacion.asunto)}</span>
              </p>
             `;
              break;
            
            case `2`:
              //console.log(`entra 2`);
                 toastHTML = `
                <p style="display: block;">
                <span>
                <b  style="color:yellow;" >
                ¡Tarea nueva!
                </b>
                </span>
                <br> <span>${(data.notificacion.asunto)}</span>
                </p>
               `;
              break;
            
            case `3`:
              //console.log(`entra 3`);
                toastHTML = `
                <p style="display: block;">
                <span>
                <b  style="color:red;" >
                ¡Tarea nueva!
                </b>
                </span>
                <br> <span>${(data.notificacion.asunto)}</span>
                </p>
               `;
                break;
          
          }
          //console.log(toastHTML);
          M.toast({html: toastHTML});
          break;
      
        case 2:
          switch (data.notificacion.prioridad) {
            case 1:
              var toastHTML = `
              <p style="display: block;">
              <span>
              <b style="color:green;" >
              ¡Llamada nueva!
              </b>
              </span>
              <br> <span>${(data.notificacion.asunto)}</span>
              </p>
             `;
              break;
            
              case `2`:
                var toastHTML = `
                <p style="display: block;">
                <span>
                <b  style="color:yellow;" >
                ¡Llamada nueva!
                </b>
                </span>
                <br> <span>${(data.notificacion.asunto)}</span>
                </p>
               `;
              break;
            
              case `3`:
                var toastHTML = `
                <p style="display: block;">
                <span>
                <b  style="color:red;" >
                ¡Llamada nueva!
                </b>
                </span>
                <br> <span>${(data.notificacion.asunto)}</span>
                </p>
               `;
                break;
          
          }
          M.toast({html: toastHTML });
          break;
        
          case 3:
            switch (data.notificacion.prioridad) {
              case 1:
                var toastHTML = `
                <p style="display: block;">
                <span>
                <b style="color:green;" >
                ¡Nota nueva!
                </b>
                </span>
                <br> <span>${(data.notificacion.asunto)}</span>
                </p>
               `;
                break;
              
                case `2`:
                  var toastHTML = `
                  <p style="display: block;">
                  <span>
                  <b  style="color:yellow;" >
                  ¡Nota nueva!
                  </b>
                  </span>
                  <br> <span>${(data.notificacion.asunto)}</span>
                  </p>
                 `;
                break;
              
                case `3`:
                  var toastHTML = `
                  <p style="display: block;">
                  <span>
                  <b  style="color:red;" >
                  ¡Nota nueva!
                  </b>
                  </span>
                  <br> <span>${(data.notificacion.asunto)}</span>
                  </p>
                 `;
                  break;
            
            }
          M.toast({html: toastHTML });
          break;
      }
      const audio = new Audio('assets/audio/notificacion.wav');
      this.getNoFinalizadas();
      // this.getNoFinalizadasTPLPNotas();
      this.nueva = true;
      audio.play();

      // ////console.log(data);
      // this.notificaciones.unshift(data.nota);
      // let count = this.notificaciones.length;
      // this.countNot(count);
    });
  }

  verificarFinalizado(notificacion) {
    let text = ``;
    switch (notificacion.tipo) {
      case 1:
        text = "¿Realmente has finalizado esta tarea?";
        break;
      case 2:
        text = "¿Realmente has finalizado esta llamada?";
        break;
      case 3:
        text = "¿Realmente has finalizado esta nota?";
        break;
    }
    Swal.fire({
      title: text,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificacionesService.update(notificacion).subscribe((resp) => {
          Swal.fire({
            position: "center",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          this.noFinalizadas--;
          this.getNotificionesPorArea(notificacion.tipo);
          this.listNotificaciones();
        });
      } else {
        notificacion.estatus = 0;
       }
    });
  }

  // getNotificationsByUser(){
  //   this.cotizacionesService.getNotificationsByUser(this.usuario.idUsuario).subscribe(
  //   (res: any) => {
  //     this.notificaciones = res;
  //     let count = this.notificaciones.length;
  //     this.countNot(count);
  //   },
  //   err => {
  //     //console.log(err);
  //   }
  //   )
  // }

  setArea(idArea: number, tipo: number) {
    this.idArea = idArea;
    this.getNotificionesPorArea(tipo);
  }

  mostrarmodalNuevaLlamadaPendiente() {
    $("#modalNotificaciones").modal("close");
    $("#modalNuevaLlamadaPendiente").modal("open");
  }

  mostrarVerLlamadasPendientes() {
    $("#modalNotificaciones").modal("close");
    this.notificacionesService.list_AreasSinFinalizar(this.usuario.idUsuario, 0, 2).subscribe((resp: any) => {
      this.areasSinFinalizar = resp;
      if(this.areasSinFinalizar.length>0)
      this.idArea = this.areasSinFinalizar[0].idArea;
      this.getNotificionesPorArea(2);
      $("#modalVerLlamadasPendientes").modal("open");
    });
  }

  mostrarModalNuevaNota() {
    $("#modalNotificaciones").modal("close");
    $("#modalNuevaNota").modal("open");
  }

  mostrarVerNotas() {
    $("#modalNotificaciones").modal("close");
    this.notificacionesService.list_AreasSinFinalizar(this.usuario.idUsuario, 0, 3).subscribe((resp: any) => {
      this.areasSinFinalizar = resp;
      if(this.areasSinFinalizar.length>0)
      this.idArea = this.areasSinFinalizar[0].idArea;
      this.getNotificionesPorArea(3);
      $("#modalVerNotas").modal("open");
      //console.log(this.areasSinFinalizar);
    });
  }

  recordatorios(){
    let channel = `channel-reminder-notifications-${this.usuario.idUsuario}`;
    let event = `new-reminder-notifications-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channel, [event], (data: any) => {
      this.recordatoriosArray.push(data.notification);
      $("#modalRecordatorios").modal("open");
    });
  }

  getCountAreas() {
    this.jerarquiasService.getCount(this.usuario.idArea).subscribe((resp: number) => {
      this.countAreas = resp;
    });
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('correo');
    localStorage.removeItem('privilegios');
    this.router.navigate(['login']);
  }

  clearLocalStorage(){
    localStorage.removeItem('idCotizacion');
    localStorage.removeItem('fechaInicio');
    localStorage.removeItem('fechaFinal');
    this.router.navigate(['home/disenoCotizacion']);
  }
}
