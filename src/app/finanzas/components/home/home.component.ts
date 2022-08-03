import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { Usuario } from 'src/app/models/Usuario';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ProductosExtrasConciergeService } from 'src/app/services/productosExtrasConcierge.service';
import { PusherService } from 'src/app/services/pusher.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ReembolsosService } from '../../services/reembolsos.service';
import { HelperService } from 'src/app/finanzas/services/helper.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HelperService]
})
export class HomeComponent implements OnInit {

  public usuario: any = new Usuario();
  public actividadesPA: any[] = [];
  public actividadesPM: any[] = [];
  public notificaciones: any[] = [];
  public notificacionesAltas: any[] = [];
  public notificacionesMedias: any[] = [];
  public notificacionesBajas: any[] = [];
  public notificacion: any;
  public countAltas = 0;
  public countMedias = 0;
  public countBajas = 0;

  constructor(
    private cp: CurrencyPipe,
    private productosExtrasService: ProductosExtrasConciergeService,
    private reembolsosService: ReembolsosService,
    private cotizacionesService: CotizacionesService,
    private notificacionesService: NotificacionesService,
    public pusherService: PusherService,
    private usuariosService: UsuariosService,
    private datePipe: DatePipe,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.getCotizaciones();
    this.getNotificaciones();
    this.getUser();
  }

  getUser(){
    this.usuariosService.getUser().subscribe((user: any) => {
      if(Object.keys(user).length === 0) return false;
      this.usuario = user;
      this.notificacionesPush();
    });
  }

  getCotizaciones(){
    this.cotizacionesService.listByFilter(0).subscribe(async(cotizaciones: any) => {
      this.actividadesPA = [];
      this.actividadesPM = [];
      for(let cotizacion of cotizaciones){
        cotizacion.valoresVenta = await this.helperService.getValoresVenta(cotizacion.idCotizacion, cotizacion.version);
        cotizacion.valoresReembolsos = await this.helperService.getValoresReembolsos(cotizacion.idCotizacion, cotizacion.version);
        cotizacion.valoresExtras = await this.helperService.getValoresExtras(cotizacion.idCotizacion);
        this.prioridadPorPago(cotizacion);
        this.prioridadPorReembolsosYExtras(cotizacion);
      }
    }, err => console.log(err));
  }

  getNotificaciones(){
    this.notificacionesService.listAllFinanzas().subscribe((data: any) => {
      this.notificacionesAltas = data.filter((cotizacion: any) => {
        if(cotizacion.prioridad == 3){
          this.countAltas += cotizacion.estatus === 0 ? 1 : 0;
          return true;
        }
      });
      this.notificacionesMedias = data.filter((cotizacion: any) => {
        if(cotizacion.prioridad == 2){
          this.countMedias += cotizacion.estatus === 0 ? 1 : 0;
          return true;
        }
      });
      this.notificacionesBajas = data.filter((cotizacion: any) => {
        if(cotizacion.prioridad == 1){
          this.countBajas += cotizacion.estatus === 0 ? 1 : 0;
          return true;
        }
      });
    });
  }

  async prioridadPorReembolsosYExtras(cotizacion: any){
    let now = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    // new Date().toLocaleDateString("en-EN", { year: 'numeric', month: '2-digit', day: '2-digit' });
    let fechaActual: any = new Date(now + 'T00:00:00').getTime();
    let limite = new Date(cotizacion.fechaFinal + 'T00:00:00').setDate(new Date(cotizacion.fechaFinal + 'T00:00:00').getDate() + 3);
    let siguienteDia = new Date(cotizacion.fechaFinal + 'T00:00:00').setDate(new Date(cotizacion.fechaFinal + 'T00:00:00').getDate() + 1);
    if(fechaActual >= new Date(cotizacion.fechaFinal).getTime()){
      let fechaLimite: any = new Date(limite).getTime();
      // Casos para establecer prioridades de extras
      if(cotizacion.valoresExtras.totalExtrasViajero > 0){
        let total = this.cp.transform(cotizacion.valoresExtras.totalExtrasViajero, cotizacion.nombreDivisa);
        if(fechaActual == siguienteDia){
          this.actividadesPM.push({
            text: `Tienes 3 días para cobrar ${total} que se invirtieron en extras`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 2
          });
        }else if(fechaActual <= fechaLimite){
          this.actividadesPA.push({
            text: `Debes cobrar ${total} que se invirtieron en extras antes del ${this.datePipe.transform(new Date(fechaLimite),"yyyy-MM-dd")}`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 3
          });
        }else{
          this.actividadesPA.push({
            text: `La fecha para cobrar ${total} invertidos en extras venció, por favor realiza el cobro a la brevedad`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 3
          });
        }
      }
      // Casos para establecer prioridades de reembolsos
      if(cotizacion.valoresReembolsos.totalAReembolsar > 0){
        let total = this.cp.transform(cotizacion.valoresReembolsos.totalAReembolsar, cotizacion.nombreDivisa);
        if(fechaActual == siguienteDia){
          this.actividadesPM.push({
            text: `Tienes 3 días para reembolsar ${total}`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 2
          });
        }else if(fechaActual <= fechaLimite){
          this.actividadesPA.push({
            text: `Debes reembolsar ${total} antes del ${this.datePipe.transform(new Date(fechaLimite),"yyyy-MM-dd")}`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 3
          });
        }else{
          this.actividadesPA.push({
            text: `La fecha para reembolsar ${total} venció, por favor realiza el reembolso a la brevedad`,
            idCotizacion: cotizacion.idCotizacion, cotizacion,
            prioridad: 3
          });
        }
      }
    }
  }

  prioridadPorPago(cotizacion: any){
    cotizacion.pagos.forEach((pago: any) =>{
      let now = new Date().toLocaleDateString("en-EN", { year: 'numeric', month: '2-digit', day: '2-digit' });
      let limite = new Date(pago.fecha + 'T00:00:00').setDate(new Date(pago.fecha + 'T00:00:00').getDate() + 2);
      let fechaActual: any = new Date(now).getTime();
      let fechaPago: any = new Date(pago.fecha + 'T00:00:00').getTime();
      let fechaLimite: any = new Date(limite).getTime();
      // Casos para establecer prioridad de pagos
      if(pago.pagoVerificado === 0){
        if(fechaActual == fechaPago){
          this.actividadesPM.push({
            text: `Tienes 3 días para verificar el pago ${pago.refPago}`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 2
          });
        }else if(fechaActual > fechaPago && fechaActual <= fechaLimite){
          this.actividadesPA.push({
            text: `Debes verificar el pago ${pago.refPago} antes del ${this.datePipe.transform(new Date(fechaLimite),"yyyy-MM-dd")}`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 3
          });
        }else{
          this.actividadesPA.push({
            text: `La fecha para verificar el pago ${pago.refPago} venció, por favor verifica el pago a la brevedad`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 3
          });
        }
      }
      // Casos para establecer prioridad de facturas
      if(pago.facturaE === 0){
        if(fechaActual == fechaPago){
          this.actividadesPM.push({
            text: `Tienes 3 días para agregar la factura del pago ${pago.refPago}`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 2
          });
        }else if(fechaActual > fechaPago && fechaActual <= fechaLimite){
          this.actividadesPA.push({
            text: `Debes agregar la factura del pago ${pago.refPago} antes del ${this.datePipe.transform(new Date(fechaLimite),"yyyy-MM-dd")}`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 3
          });
        }else{
          this.actividadesPA.push({
            text: `La fecha para agregar la factura del pago ${pago.refPago} venció, por favor agrega la factura a la brevedad`,
            idCotizacion: cotizacion.idCotizacion,
            prioridad: 3
          });
        }
      }
    });
  }

  getTotalExtrasConcierge(idCotizacion: number){
    return new Promise((resolve, reject)=> {
      this.productosExtrasService.getTotalExtrasConcierge(idCotizacion).subscribe((data: any) => {
        return resolve(data.total);
      });
    });
  }

  getTotalReembolsos(idCotizacion: number){
    return new Promise((resolve, reject)=> {
      this.reembolsosService.getTotalReembolsos(idCotizacion).subscribe((data: any) => {
        return resolve(data.total);
      });
    });
  }

  jsonDecode(item, tipo) {
    let data = JSON.parse(item);
    let text = '';
    switch(tipo){
      case 1:
        text = data.tarea;
        break;
      case 2:
        text = `Marcar ha ${data.nombre} (${data.numero}), ${data.motivo}`;
        break;
      case 3:
        text = data.nota;
        break;
    }
    return text;
  }

  verNotificacion(notificacion: any){
    this.notificacion = notificacion;
    $('#VerNotificacion').modal({ dismissible: false});
    $('#VerNotificacion').modal('open');
  }

  notificacionesPush(){
    let channel = `channel-notification-${this.usuario.idUsuario}`;
    let event = `new-notification-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channel, [event], (data: any) => {
      this.notificacionesService.listOne(data.notificacion.idNotificacion).subscribe((notificacion: any) => {
        switch(notificacion.prioridad){
          case 1:
            this.notificacionesBajas.unshift(notificacion);
            this.countBajas++;
          break;
          case 2:
            this.notificacionesMedias.unshift(notificacion);
            this.countMedias++;
          break;
          case 3:
            this.notificacionesAltas.unshift(notificacion);
            this.countAltas++;
          break;
        }
      });
    });
  }

  verificarFinalizado(notificacion) {
    let text = ``;
    switch(notificacion.tipo){
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
    notificacion.estatus = 1;
    Swal.fire({
      title: text,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if(result.isConfirmed){
        let n = Object.assign({}, notificacion);
        n.data = JSON.parse(notificacion.data);
        this.notificacionesService.update(n).subscribe((resp) => {
          $('#VerNotificacion').modal('close');
          switch(notificacion.prioridad){
            case 1:
              let indexB = this.notificacionesBajas.findIndex(n => n.idNotificacion == notificacion.idNotificacion);
              this.notificacionesBajas.splice(indexB, 1);
              this.countBajas--;
            break;
            case 2:
              let indexM = this.notificacionesMedias.findIndex(n => n.idNotificacion == notificacion.idNotificacion);
              this.notificacionesMedias.splice(indexM, 1);
              this.countMedias--;
            break;
            case 3:
              let indexA = this.notificacionesAltas.findIndex(n => n.idNotificacion == notificacion.idNotificacion);
              this.notificacionesAltas.splice(indexA, 1);
              this.countAltas--;
            break;
          }
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha finalizado la notificación",
            showConfirmButton: false,
            timer: 1000,
          });
        });
      }else{
        notificacion.estatus = 0;
      }
    });
  }

}
